class LogMessagesController < ApplicationController
  def index
    f = FakeDnsServer.find(params[:fake_dns_server_id])
    log_messages = f.log_messages.order('created_at desc').limit(100)
    render json: { log_messages: log_messages}
  end
end
