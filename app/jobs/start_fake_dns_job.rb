class StartFakeDnsJob < ApplicationJob
  queue_as :default

  def perform(server_id, *args)
    s = FakeDnsServer.find(server_id)
    s.log_messages.destroy_all
    p 'perform', s
    RubyDnsService.start s
  end
end
