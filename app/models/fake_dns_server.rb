class FakeDnsServer < ApplicationRecord
  has_many :log_messages, dependent: :destroy

  validates_presence_of :name, :target_server, :upstream
  def status
    running_server = RubyDnsService.running_server
    {
      running: RubyDnsService.running?(self.id),
      server_id: if running_server then running_server.id end
    }
  end
end
