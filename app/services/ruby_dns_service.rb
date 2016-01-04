
class RubyDnsService
  @@pid = nil
  @@server = nil
  @@mutex = Mutex.new
  def self.start(s)
    self.stop(s) if self.running?
    @@mutex.synchronize do
      RubyDnsService.new(s).start
    end
  end

  def self.stop(s)
    Process.kill('TERM', @@pid)
    Process.wait(@@pid)
    sleep 1
  rescue

  end

  def self.running?(server_id = nil)
    if server_id and @@server
      if server_id != @@server.id
        return false
      end
    end
    if @@pid
      Process.kill 0, @@pid
      true
    else
      false
    end
  rescue
    false
  end

  def initialize(s)
    @server = s
  end

  def start
    require "open3"
    @@server = @server.reload
    Open3.popen3(RbConfig.ruby) do |i, o, e, w|
      ActionCable.server.broadcast 'dns_channel', status: { running: true, server_id: @server.id }
      p w.pid
      @@pid = w.pid
      #puts dns_script
      i.puts dns_script
      i.close
      Thread.start do
        e.each do |line|
          m = parse_json_message(line)
          #puts m['message']
          @server.log_messages.create message: m['message']
        end
      end
      o.each do |line|
        #puts line
        @server.log_messages.create message: line
      end
      ActionCable.server.broadcast 'dns_channel', status: { running: false, server_id: @server.id }
      @server.log_messages.create message: 'server terminated' rescue nil
      @@pid = nil
    end
  rescue
    @@pid = nil
    p $!
    puts $@
  end

  def parse_json_message(line)
    JSON.parse(line)
  rescue
    { 'message' => line.sub(/^I.*-- :/,'') }
  end

  def dns_script
    upstream = @server.upstream
    target_server = @server.target_server
    hooking_hostnames = @server.hooking_hostnames
    p upstream, target_server, hooking_hostnames
    <<-EOS
require 'rubydns'
require 'rubydns/system'
require 'niboshi_json_formatter'

INTERFACES = [
  [:udp, "0.0.0.0", 5300],
  [:tcp, "0.0.0.0", 5300]
]

Name = Resolv::DNS::Name
IN = Resolv::DNS::Resource::IN

UPSTREAM = RubyDNS::Resolver.new([[:udp, "#{upstream}", 53]])

FAKE_HOSTS = %w{
  #{hooking_hostnames}
}

RubyDNS::run_server(:listen => INTERFACES) do
  on(:start) do
		@logger.level = Logger::INFO
    @logger.formatter = Niboshi::JsonFormatter.new
    @logger.info "dns server started for #{target_server}"
	end

  FAKE_HOSTS.each do |h|
    match(h, IN::A) do |transaction|
      answer_cname = Name.create('#{target_server}')
      transaction.respond!(answer_cname, resource_class: IN::CNAME, ttl: 0)
    end
  end

  #passthrough
  otherwise do |transaction|
    transaction.passthrough!(UPSTREAM)
  end
end

    EOS
  end
end
