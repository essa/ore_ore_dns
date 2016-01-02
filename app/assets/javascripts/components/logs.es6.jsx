class Logs extends React.Component {
  componentDidMount() {
    console.log('didMount', this, this.props);
    this.setState({log_messages: []});
    $.get(`/fake_dns_servers/${this.props.id}.json`, (res) =>{
      this.setState({running: res.status.running});
    });
    $.get(`/fake_dns_servers/${this.props.id}/log_messages`, (res) =>{
      this.setState({log_messages: res.log_messages});
    });
  }
  onClickStart(e) {
    App.dns.start_server(this.props.id, this);
  }
  onClickStop(e) {
    App.dns.stop_server(this.props.id, this);
  }
  onClickClear(e) {
    //this.setState({log_messages: []});
    App.dns.clear_logs(this.props.id, this);
    $.get(`/fake_dns_servers/${this.props.id}/log_messages`, (res) =>{
      this.setState({log_messages: res.log_messages});
    });
  }
  onReceiveMessage(data) {
    console.log(data);
    let m = this.state.log_messages;
    m.unshift(data);
    this.setState({log_messages: m});
  }
  onUpdateStatus(data) {
    console.log(data);
    this.setState({running: data.running});
  }
  render () {
    if (!this.state) {
      return <div>loading...</div>;
    }
    const messages = this.state.log_messages.map((m)=>{
      return <LogMessage key={m.id} message={m.message} created_at={m.created_at}/>;
    });
    const onClickStart = this.onClickStart.bind(this);
    const onClickStop = this.onClickStop.bind(this);
    const onClickClear = this.onClickClear.bind(this);
    let runningMessage = '';
    if (this.state.running)
      runningMessage = 'running';
    return (
      <div>
        <div>
          Name: {this.props.name}
        </div>
        <div>
          Status: {runningMessage}
        </div>
        <div>
          <button onClick={onClickStart} disabled={this.state.running} >Start Server</button>
          <button onClick={onClickStop} disabled={!this.state.running} >Stop Server</button>
          <button onClick={onClickClear}>Clear logs</button>
        </div>
        Logs:
        <div style={{height: '400px', 'overflowX': 'scroll'}}>
        <table>
        {messages}
        </table>
        </div>
      </div>
    );
  }
}

Logs.propTypes = {
  name: React.PropTypes.string
};
