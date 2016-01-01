class FakeDnsServer < ApplicationRecord
  has_many :log_messages, dependent: :destroy

  def start
    p 'start'
  end
end
