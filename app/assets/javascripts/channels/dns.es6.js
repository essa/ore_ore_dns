
var emitter = new EventEmitter2();
App.dns = App.cable.subscriptions.create("DnsChannel", {
  connected: function() {
    console.log('connected');
  },
  disconnected: function() {
    console.log('disconnected');
  },
  received: function(data) {
    if (data.message) {
      emitter.emit("cable.dns.message", data);
    }
    if (data.status) {
      emitter.emit("cable.dns.status", data);
    }
  },
  start_server: function(server_id) {
    return this.perform('start_server', { server_id: server_id });
  },
  stop_server: function(server_id) {
    return this.perform('stop_server', { server_id: server_id });
  },
  clear_logs: function(server_id) {
    return this.perform('clear_logs', { server_id: server_id });
  },
  on: function(event, listner) { emitter.on(event, listner) },
  off: function(event, listner) { emitter.off(event, listner)}
});
