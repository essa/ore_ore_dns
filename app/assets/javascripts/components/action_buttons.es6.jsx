
class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { running: false};
  }
  componentDidMount() {
    App.dns_event.on('cable.dns.status', (data)=>{
      this.setState({running: data.status.running});
    });
    $.get(`/fake_dns_servers/${this.props.server_id}.json`, (res) =>{
      this.setState({running: res.status.running});
    });
  }
  render () {
    const Button = window.ReactPure.Button;
    return (
      <Button key={this.props.key} onClick={this.onClick.bind(this)} disabled={this.disabled()}>{this.props.text}</Button>
    );
  }
}

ActionButton.propTypes = {
  text: React.PropTypes.string,
  server_id: React.PropTypes.number
};

class StartButton extends ActionButton {
  disabled() {
    return this.state.running;
  }
  onClick() {
    App.dns.start_server(this.props.server_id, this);
  }
}

StartButton.defaultProps = {text: "Start Server"};

class StopButton extends ActionButton {
  disabled() {
    return ! this.state.running;
  }
  onClick() {
    App.dns.stop_server(this.props.server_id, this);
  }
}

StopButton.defaultProps = {text: "Stop Server"};
