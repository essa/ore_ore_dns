App.dns = App.cable.subscriptions.create("DnsChannel", {
  connected: function() {},
  disconnected: function() {},
  received: function(data) {},
  start_server: function() {
    return this.perform('start_server');
  }
});
