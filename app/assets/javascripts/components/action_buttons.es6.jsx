
class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: props.initialStatus || {}};
  }
  componentDidMount() {
    this.statusListener = (data)=>this.setState({status: data.status});
    App.dns.onUpdateStatus(this.statusListener);
  }
  componentWillUnmount() {
    App.dns.offUpdateStatus(this.statusListener);
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
    return this.props.server_id == this.state.status.server_id && this.state.status.running;
  }
  onClick() {
    App.dns.start_server(this.props.server_id, this);
  }
}

StartButton.defaultProps = {text: "Start Server"};

class StopButton extends ActionButton {
  disabled() {
    return this.props.server_id != this.state.status.server_id || !this.state.status.running;
  }
  onClick() {
    App.dns.stop_server(this.props.server_id, this);
  }
}

StopButton.defaultProps = {text: "Stop Server"};

class StatusMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: props.initialStatus };
  }
  componentDidMount() {
    this.statusListener = (data)=>this.setState({status: data.status});
    App.dns.onUpdateStatus(this.statusListener);
  }
  componentWillUnmount() {
    App.dns.offUpdateStatus(this.statusListener);
  }
  render () {
    const status = this.state.status || {};
    const running = status.server_id == this.props.server_id && status.running;
    const runningMessage = running?'running':'';
    return (<span>{runningMessage}</span>);
  }
}

class ClearLogButton extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickClear(e) {
    App.dns.clear_logs(this.props.server_id);
  }

  render () {
    const Button = window.ReactPure.Button;
    return (
      <Button key={this.props.key} onClick={this.onClickClear.bind(this)} >{this.props.text}</Button>
    );
  }
}
ClearLogButton.defaultProps = {text: "Clear Logs"};
