

class RubyDnsService

  def self.start(s)
    Thread.start(s) do |server|
      RubyDnsService.new(server).start
    end
  end

  def initialize(s)
    @server = s
  end

  def start
    require "open3"
    Open3.popen3(RbConfig.ruby) do |i, o, e, w|
      s = dns_script
      puts s
      i.puts s
      i.close
      Thread.start do
        e.each do |line|
          puts line
        end
      end
      o.each do |line|
        puts line
      end
      puts "process end"
      p w
    end
  rescue
    p $!
    puts $@
  end

  def dns_script
    <<-EOS
puts 12334555
require 'rubydns'
require 'rubydns/system'

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
  FAKE_HOSTS.each do |h|
    match(h, IN::A) do |transaction|
      puts 'staging host'
      #transaction.respond!(UPSTREAM.addresses_for('bluegreen-haproxy-live-1423424729.ap-northeast-1.elb.amazonaws.com').first)
      transaction.respond!(UPSTREAM.addresses_for('bluegreen-haproxy-staged-716614297.ap-northeast-1.elb.amazonaws.com').first)
      #transaction.respond!("192.168.99.77")
    end
  end

  #passthrough
  otherwise do |transaction|
    puts "upstream"
    transaction.passthrough!(UPSTREAM)
  end
end

    EOS
  end

  def self.start_x(s)
    p "RubyDnsService#start", s
    Thread.start do
      RubyDNS::run_server(:listen => INTERFACES) do
        FAKE_HOSTS.each do |h|
          match(/#{h}/, IN::A) do |transaction|
            puts 'staging host'
            #transaction.respond!(UPSTREAM.addresses_for('bluegreen-haproxy-live-1423424729.ap-northeast-1.elb.amazonaws.com').first)
            transaction.respond!(UPSTREAM.addresses_for('bluegreen-haproxy-staged-716614297.ap-northeast-1.elb.amazonaws.com').first)
          end
        end

        #passthrough
        otherwise do |transaction|
          puts "upstream"
          transaction.passthrough!(UPSTREAM)
        end
      end
    end
  end
end
