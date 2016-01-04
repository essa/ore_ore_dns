App.dns_event = new EventEmitter2();
App.dns = App.cable.subscriptions.create("DnsChannel", {
  connected: function() {
    console.log('connected');
  },
  disconnected: function() {
    console.log('disconnected');
  },
  received: function(data) {
    if (data.message) {
      App.dns_event.emit("cable.dns.message", data);
    }
    if (data.status) {
      App.dns_event.emit("cable.dns.status", data);
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
