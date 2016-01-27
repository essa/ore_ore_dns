require 'rubydns'
require 'niboshi_json_formatter'

INTERFACES = [
  [:udp, "0.0.0.0", 5300],
  [:tcp, "0.0.0.0", 5300]
]

Name = Resolv::DNS::Name
IN = Resolv::DNS::Resource::IN
UPSTREAM = RubyDNS::Resolver.new([[:udp, "8.8.8.8", 53]])

RubyDNS::run_server(:listen => INTERFACES) do
  on(:start) do
		@logger.level = Logger::DEBUG
    @default_answers = UPSTREAM.addresses_for('store.degica.com').map do |a|
      IN::A.new(a)
    end
    p @default_answers
	end

  match(/.*.degica.com/, IN::A) do |transaction|
    transaction.add(@default_answers, ttl:5)
    answer_cname = Name.create('store.degica.com')
    transaction.respond!(answer_cname, resource_class: IN::CNAME, ttl: 5)
  end

  #passthrough
  otherwise do |transaction|
    transaction.passthrough!(UPSTREAM) do |response|
      response.answer.each do |a|
        @logger.info a[2]
        a[2].instance_eval { @ttl = 5 }
      end
      @logger.info response

    end
  end
end
