class StartFakeDnsJob < ApplicationJob
  queue_as :default

  def perform(server_id, *args)
    s = FakeDnsServer.find(server_id)
    p 'perform', s
    RubyDnsService.start s
  end
end
