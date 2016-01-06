class AddRecordTypeAndLogLevelToFakeDnsServer < ActiveRecord::Migration[5.0]
  def change
    add_column :fake_dns_servers, :record_type, :string
    add_column :fake_dns_servers, :loglevel, :string
  end
end
