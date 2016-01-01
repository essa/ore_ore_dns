# Be sure to restart your server when you modify this file. Action Cable runs in an EventMachine loop that does not support auto reloading.
class DnsChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "dns_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def start_server(params)
    p 772232, params['server_id']
    StartFakeDnsJob.perform_later params['server_id']
  end
end
