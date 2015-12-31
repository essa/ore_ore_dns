class Logs extends React.Component {
  componentDidMount() {
    console.log('didMount', this, this.props);
    $.get(`/fake_dns_servers/${this.props.id}/log_messages`, (res) =>{
      console.log(res);
      this.setState({log_messages: res.log_messages});
    });
  }
  render () {
    if (!this.state) {
      return <div>loading...</div>;
    }
    const messages = this.state.log_messages.map((m)=>{
      console.log(m);
      return <LogMessage key={m.id} message={m.message} created_at={m.created_at}/>;
    })
    return (
      <div>
        <div>Name: {this.props.name}</div>
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
