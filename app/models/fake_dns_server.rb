class FakeDnsServer < ApplicationRecord
  has_many :log_messages, dependent: :destroy
  def status
    { running: RubyDnsService.running?(self) }
  end
end
