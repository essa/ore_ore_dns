
import EventEmitter3 from 'eventemitter3';

const cable = ActionCable.createConsumer('ws://localhost:5000/cable');
const emitter = new EventEmitter3();

const dns_channel = cable.subscriptions.create("DnsChannel",{
    connected: ()=>{
      console.log('connected');
    },
    disconnected() {
      console.log('disconnected');
    },
    received (data) {
      console.log("received", data);
      if (data.message) {
        emitter.emit("cable.dns.message", data);
      }
      if (data.status) {
        emitter.emit("cable.dns.status", data);
      }
    },
    start_server(server_id) {
      dns_channel.perform('start_server', { server_id: server_id });
    },
    stop_server(server_id) {
      dns_channel.perform('stop_server', { server_id: server_id });
    },
    clear_logs(server_id) {
      dns_channel.perform('clear_logs', { server_id: server_id });
    },
    onMessage(listner) { emitter.on('cable.dns.message', listner); },
    offMessage(listner) { emitter.on('cable.dns.message', listner); },
    onUpdateStatus(listner) { emitter.on('cable.dns.status', listner); },
    offUpdateStatus(listner) { emitter.on('cable.dns.status', listner); },
  }
);

export default dns_channel;
