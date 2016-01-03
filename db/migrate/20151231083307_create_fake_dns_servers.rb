class CreateFakeDnsServers < ActiveRecord::Migration[5.0]
  def change
    create_table :fake_dns_servers do |t|
      t.string :name
      t.string :target_server
      t.string :upstream
      t.string :trace_level
      t.text   :hooking_hostnames

      t.timestamps
    end
  end
end
