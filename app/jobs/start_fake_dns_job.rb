class StartFakeDnsJob < ApplicationJob
  queue_as :default

  def perform(params, *args)
    p params
    server_id = params['server_id']
    s = FakeDnsServer.find(server_id)
    if params[:command] == 'start'
      RubyDnsService.start s
    else
      RubyDnsService.stop s
    end
  end
end
