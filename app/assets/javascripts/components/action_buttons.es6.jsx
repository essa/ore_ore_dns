
class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { running: false};
  }
  render () {
    const Button = window.ReactPure.Button;
    return (
      <Button onClick={this.onClick.bind(this)} disabled={this.disabled()}>{this.props.text}</Button>
    );
  }
}

ActionButton.propTypes = {
  text: React.PropTypes.string,
  server_id: React.PropTypes.number
};

class StartButton extends ActionButton {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    App.dns_event.on('cable.dns.status', (data)=>{
      this.setState({running: data.status.running});
    });
  }
  disabled() {
    return this.state.running;
  }
  onClick() {
    App.dns.start_server(this.props.server_id, this);
  }
}

StartButton.defaultProps = {text: "Start Server"};
