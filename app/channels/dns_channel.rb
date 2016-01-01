# Be sure to restart your server when you modify this file. Action Cable runs in an EventMachine loop that does not support auto reloading.
class DnsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "dns_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def start_server(params)
    ActionCable.server.broadcast 'dns_channel', message: 'server starting'
    StartFakeDnsJob.perform_later params.merge(command: 'start')
  end

  def stop_server(params)
    StartFakeDnsJob.perform_later params.merge(command: 'stop')
  end

  def clear_logs(params)
    s = FakeDnsServer.find(params['server_id'])
    s.log_messages.destroy_all
  end
end
