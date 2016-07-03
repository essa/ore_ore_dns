
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

  def self.running_server
    @@server
  end

  def initialize(s)
    @server = s
  end

  def start
    require "open3"
    @@server = @server.reload
    Open3.popen3(RbConfig.ruby) do |i, o, e, w|
      ActiveRecord::Base.connection_pool.with_connection do

        ActionCable.server.broadcast 'dns_channel', status: { running: true, server_id: @server.id }
        p w.pid
        @@pid = w.pid
        #puts dns_script
        i.puts dns_script
        i.close
        Thread.start do
          ActiveRecord::Base.connection_pool.with_connection do
            e.each do |line|
              m = parse_json_message(line)
              #puts m['message']
              @server.log_messages.create message: m['message']
            end
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
    record_type = @server.record_type || 'A'
    hooking_hostnames = @server.hooking_hostnames
    loglevel = @server.loglevel || 'DEBUG'
    p upstream, target_server, record_type, hooking_hostnames, loglevel
    <<-EOS
require 'rubydns'
require 'niboshi_json_formatter'

INTERFACES = [
  [:udp, "0.0.0.0", 5300],
  [:tcp, "0.0.0.0", 5300]
]

Name = Resolv::DNS::Name
IN = Resolv::DNS::Resource::IN

UPSTREAM = RubyDNS::Resolver.new([[:tcp, "#{upstream}", 53], [:udp, "#{upstream}", 53]])

FAKE_HOSTS = %w{
  #{hooking_hostnames}
}

def answer_for_cname(transaction)
  transaction.add(@default_answers, ttl:5)
  answer_cname = Name.create(@target_server)
  transaction.respond!(answer_cname, resource_class: IN::CNAME, ttl: 5)
end

def answer_for_a(transaction)
  a = '#{target_server}'
  transaction.respond!(a, resource_class: IN::A, ttl: 5)
end

RubyDNS::run_server(:listen => INTERFACES) do
  on(:start) do
		@logger.level = Logger::#{loglevel}
    @logger.formatter = Niboshi::JsonFormatter.new
    @target_server = '#{target_server}'
    unless @target_server == ''
      @default_answers = UPSTREAM.addresses_for(@target_server).map do |a|
        IN::A.new(a)
      end
    end
    @logger.info "dns server started for #{target_server}"
    @logger.info "default answer = #\{@default_answers.inspect}"
	end

  FAKE_HOSTS.each do |h|
    if h[0] == '!'
      h = h[1..-1]
      match(h, IN::A) do |transaction|
        transaction.passthrough!(UPSTREAM)
      end
    else
      if h.include?('*')
        h.gsub!('.', '\\.')
        h.gsub!('*', '.*')
        match(Regexp.new(h), IN::A) do |transaction|
          answer_for_#{record_type.downcase}(transaction)
        end
      else
        match(h, IN::A) do |transaction|
          answer_for_#{record_type.downcase}(transaction)
        end
      end
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
