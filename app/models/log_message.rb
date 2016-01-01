class LogMessage < ApplicationRecord
  belongs_to :fake_dns_server
  after_create_commit do
    ActionCable.server.broadcast 'dns_channel', self
  end
end
