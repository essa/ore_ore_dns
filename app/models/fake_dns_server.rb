class FakeDnsServer < ApplicationRecord
  has_many :log_messages, dependent: :destroy
end
