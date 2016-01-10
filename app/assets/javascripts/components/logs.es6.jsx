

class Logs extends React.Component {
  constructor(props) {
   super(props);
   this.state = {log_messages: []};
  }

  componentDidMount() {
    console.log('DidMount');
    App.dns.onMessage(this.onMessage.bind(this));

    $.get(`/fake_dns_servers/${this.props.id}/log_messages`, (res) =>{
      this.setState({log_messages: res.log_messages});
    });
  }

  componentWillUnmount() {
    App.dns.offMessage(this.onMessage);
  }

  onMessage(data) {
    let m = this.state.log_messages;
    if (data.message == '__CLEAR__')
      m = [];
    else
      m.unshift(data);
    this.setState({log_messages: m});
  };


  render () {
    const Cell = window.ReactPure.Cell;
    const Table = window.ReactPure.Table;
    if (!this.state) {
      return <div>loading...</div>;
    }
    const messages = this.state.log_messages.map((m)=>{
      const hms = moment(m.created_at).format('HH:MM:ss');
      return (
        <tr key={m.id}>
          <td>{hms}</td>
          <td>{m.message}</td>
        </tr>
      );
    });
    const status = this.state.status;
    return (
      <Cell>
        <Cell size='2'>&nbsp;Logs</Cell>
        <Cell size='10' style={{height: '400px', 'overflowX': 'scroll'}}>
          <Table>
            <tbody>
              {messages}
            </tbody>
          </Table>
        </Cell>
        <Cell>&nbsp;</Cell>
      </Cell>
    );
  }
}

Logs.propTypes = {
  name: React.PropTypes.string
};
