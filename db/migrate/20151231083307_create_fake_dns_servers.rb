class CreateFakeDnsServers < ActiveRecord::Migration[5.0]
  def change
    create_table :fake_dns_servers do |t|
      t.string :name
      t.string :default_server

      t.timestamps
    end
  end
end
