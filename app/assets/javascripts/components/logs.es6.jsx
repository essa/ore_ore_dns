

class Logs extends React.Component {
  constructor(props) {
   super(props);
   this.state = {log_messages: [], running: false};
  }

  componentDidMount() {
    App.dns_event.on('cable.dns.message', (data)=>{
      let m = this.state.log_messages;
      m.unshift(data);
      this.setState({log_messages: m});
    });
    App.dns_event.on('cable.dns.status', (data)=>{
      this.setState({running: data.status.running});
    });
    $.get(`/fake_dns_servers/${this.props.id}/log_messages`, (res) =>{
      this.setState({log_messages: res.log_messages});
    });
  }

  onClickClear(e) {
    //this.setState({log_messages: []});
    App.dns.clear_logs(this.props.id, this);
    $.get(`/fake_dns_servers/${this.props.id}/log_messages`, (res) =>{
      this.setState({log_messages: res.log_messages});
    });
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
          <StartButton key='start' server_id={this.props.id} />
          &nbsp;
          <StopButton key='stop' server_id={this.props.id} />
          &nbsp;
          <Button key='clear' onClick={onClickClear}>Clear Logs</Button>
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
