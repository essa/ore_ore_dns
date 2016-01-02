

class RubyDnsService
  @@pid = nil
  def self.start(s)
    Thread.start(s) do |server|
      RubyDnsService.new(server).start
    end
  end

  def self.stop(s)
    Process.kill('TERM', @@pid)
  end

  def self.running?(server_id = nil)
    if server_id and @server
      if server_id != @server.id
        return false
      end
    end
    if @@pid
      Process.kill 0, @@pid rescue false
      true
    else
      false
    end
  end

  def initialize(s)
    @server = s
  end

  def start
    require "open3"
    Open3.popen3(RbConfig.ruby) do |i, o, e, w|
      ActionCable.server.broadcast 'dns_channel', status: { running: true }
      p w.pid
      @@pid = w.pid
      i.puts dns_script
      i.close
      Thread.start do
        e.each do |line|
          m = parse_json_message(line)
          p m
          @server.log_messages.create message: m['message']
        end
      end
      o.each do |line|
        @server.log_messages.create message: line
      end
      ActionCable.server.broadcast 'dns_channel', status: { running: false }
      @server.log_messages.create message: 'server terminated'
      p w
    end
  rescue
    p $!
    puts $@
  end

  def parse_json_message(line)
    JSON.parse(line)
  rescue
    { 'message' => line.sub(/^I.*-- :/,'') }
  end

  def dns_script
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

UPSTREAM = RubyDNS::Resolver.new([[:udp, "8.8.8.8", 53]])
CONSUL = RubyDNS::Resolver.new([[:udp, "127.0.0.1", 8600]])

FAKE_HOSTS = %w{
  store.degica.com
  steam.degica.com
  basecamp2.degica.com
}

RubyDNS::run_server(:listen => INTERFACES) do
  on(:start) do
		@logger.level = Logger::DEBUG
    @logger.formatter = Niboshi::JsonFormatter.new
    @logger.info 'dns server started'
	end

  FAKE_HOSTS.each do |h|
    match(h, IN::A) do |transaction|
      #transaction.respond!(UPSTREAM.addresses_for('bluegreen-haproxy-live-1423424729.ap-northeast-1.elb.amazonaws.com').first)
      #transaction.respond!(UPSTREAM.addresses_for('bluegreen-haproxy-staged-716614297.ap-northeast-1.elb.amazonaws.com').first)
      transaction.respond!("192.168.99.77")
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
