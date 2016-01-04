class FakeDnsServer < ApplicationRecord
  has_many :log_messages, dependent: :destroy

  validates_presence_of :name, :target_server, :upstream
  def status
    { running: RubyDnsService.running?(self.id) }
  end
end
