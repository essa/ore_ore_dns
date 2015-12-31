json.array!(@fake_dns_servers) do |fake_dns_server|
  json.extract! fake_dns_server, :id, :name, :default_server
  json.url fake_dns_server_url(fake_dns_server, format: :json)
end
