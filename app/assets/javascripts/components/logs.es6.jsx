

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
    const Button = window.ReactPure.Button;
    const Cell = window.ReactPure.Cell;
    const Table = window.ReactPure.Table;
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
      <Cell size='18'>
        <Cell>
          Status:
          {runningMessage}
        </Cell>
        <Cell>
          <Button onClick={onClickStart} disabled={this.state.running} class="pure-button">Start Server</Button>
          &nbsp;
          <Button onClick={onClickStop} disabled={!this.state.running} >Stop Server</Button>
          &nbsp;
          <Button onClick={onClickClear}>Clear logs</Button>
        </Cell>
        <Cell size='2'>&nbsp;Logs</Cell>
        <Cell size='10' style={{height: '400px', 'overflowX': 'scroll'}}>
          <Table>
            {messages}
          </Table>
        </Cell>
      </Cell>
    );
  }
}

Logs.propTypes = {
  name: React.PropTypes.string
};
