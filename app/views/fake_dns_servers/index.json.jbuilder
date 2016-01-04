json.array!(@fake_dns_servers) do |fake_dns_server|
  json.extract! fake_dns_server, :id, :name, :status
  json.url fake_dns_server_url(fake_dns_server, format: :json)
end
