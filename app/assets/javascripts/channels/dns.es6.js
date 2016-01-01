App.dns = App.cable.subscriptions.create("DnsChannel", {
  connected: function() {
    console.log('connected');
  },
  disconnected: function() {
    console.log('disconnected');
  },
  received: function(data) {
    if (this.component) {
      this.component.onReceiveMessage(data);
    }
  },
  start_server: function(server_id, component) {
    this.component = component;
    return this.perform('start_server', { server_id: server_id });
  },
  stop_server: function(server_id, component) {
    this.component = component;
    return this.perform('stop_server', { server_id: server_id });
  },
  clear_logs: function(server_id, component) {
    this.component = component;
    return this.perform('clear_logs', { server_id: server_id });
  }
});
