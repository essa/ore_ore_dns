class StartFakeDnsJob < ApplicationJob
  queue_as :default

  def perform(server_id, *args)
    s = FakeDnsServer.find(server_id)
    p 'perform', s
    s.start
  end
end
