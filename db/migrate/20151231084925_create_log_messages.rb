class CreateLogMessages < ActiveRecord::Migration[5.0]
  def change
    create_table :log_messages do |t|
      t.integer :fake_dns_server_id
      t.integer :level
      t.text :message

      t.timestamps
    end
  end
end
