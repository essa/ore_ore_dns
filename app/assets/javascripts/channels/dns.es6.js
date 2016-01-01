App.dns = App.cable.subscriptions.create("DnsChannel", {
  connected: function() {},
  disconnected: function() {},
  received: function(data) {},
  start_server: function(server_id) {
    return this.perform('start_server', { server_id: server_id });
  }
});
