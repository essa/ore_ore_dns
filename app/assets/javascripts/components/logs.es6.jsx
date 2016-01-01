class Logs extends React.Component {
  componentDidMount() {
    console.log('didMount', this, this.props);
    $.get(`/fake_dns_servers/${this.props.id}/log_messages`, (res) =>{
      console.log(res);
      this.setState({log_messages: res.log_messages});
    });
  }
  onClickStart(e) {
    App.dns.start_server(this.props.id, this);
  }
  onReceiveMessage(data) {
    console.log(data);
    let m = this.state.log_messages;
    m.push(data);
    console.log(m);
    this.setState({log_messages: m});
  }
  render () {
    if (!this.state) {
      return <div>loading...</div>;
    }
    const messages = this.state.log_messages.map((m)=>{
      return <LogMessage key={m.id} message={m.message} created_at={m.created_at}/>;
    });
    const onClickStart = this.onClickStart.bind(this);
    return (
      <div>
        <div>
          Name: {this.props.name}
          <button onClick={onClickStart}>Start Server</button>
        </div>
        Logs:
        <table>
        {messages}
        </table>
      </div>
    );
  }
}

Logs.propTypes = {
  name: React.PropTypes.string
};
