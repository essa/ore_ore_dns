class LogMessagesController < ApplicationController
  def index
    f = FakeDnsServer.find(params[:fake_dns_server_id])
    render json: { log_messages: f.log_messages}
  end
end
