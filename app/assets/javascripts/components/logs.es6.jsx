class Logs extends React.Component {
  componentDidMount() {
    console.log('didMount', this, this.props);
    $.get(`/fake_dns_servers/${this.props.id}/log_messages`, (res) =>{
      console.log(res);
      this.setState({log_messages: res.log_messages});
    });
  }
  onClickStart(e) {
    console.log('onClick', this);
    App.dns.start_server(this.props.id);
  }
  render () {
    if (!this.state) {
      return <div>loading...</div>;
    }
    const messages = this.state.log_messages.map((m)=>{
      console.log(m);
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
