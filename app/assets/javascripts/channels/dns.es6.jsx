
// let emitter = new EventEmitter2();
App.dns = App.cable.subscriptions.create("DnsChannel", {
  emitter: new EventEmitter2(),
  connected() {
    console.log('connected')
  },
  disconnected() {
    console.log('disconnected')
  },
  received (data) {
    if (data.message) {
      this.emitter.emit("cable.dns.message", data);
    }
    if (data.status) {
      this.emitter.emit("cable.dns.status", data);
    }
  },
  start_server(server_id) {
    this.perform('start_server', { server_id: server_id });
  },
  stop_server(server_id) {
    this.perform('stop_server', { server_id: server_id });
  },
  clear_logs(server_id) {
    this.perform('clear_logs', { server_id: server_id });
  },
  on(event, listner) { this.emitter.on(event, listner) },
  off(event, listner) { this.emitter.off(event, listner)}
});
