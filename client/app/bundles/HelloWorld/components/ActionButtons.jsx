// HelloWorldWidget is an arbitrary name for any "dumb" component. We do not recommend suffixing
// all your dump component names with Widget.

import React, { PropTypes } from 'react';
import DnsChannel from '../startup/dns_channel';
import Button from './Button';
import Cell from './Cell';

class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: props.initialStatus || {}};
  }
  componentDidMount() {
    console.log(DnsChannel.onUpdateStatus);
    console.log(DnsChannel);
    this.statusListener = (data)=>this.setState({status: data.status});
    DnsChannel.actions.onUpdateStatus(this.statusListener);
  }
  componentWillUnmount() {
    DnsChannel.actions.offUpdateStatus(this.statusListener);
  }
  render () {
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
    DnsChannel.actions.start_server(this.props.server_id, this);
  }
}

StartButton.defaultProps = {text: "Start Server"};

class StopButton extends ActionButton {
  disabled() {
    return this.props.server_id != this.state.status.server_id || !this.state.status.running;
  }
  onClick() {
    DnsChannel.actions.stop_server(this.props.server_id, this);
  }
}

StopButton.defaultProps = {text: "Stop Server"};

class StatusMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { status: props.initialStatus };
  }
  componentDidMount() {
    console.log(DnsChannel.onUpdateStatus);
    console.log(DnsChannel);
    this.statusListener = (data)=>this.setState({status: data.status});
    DnsChannel.actions.onUpdateStatus(this.statusListener);
  }
  componentWillUnmount() {
    DnsChannel.actions.offUpdateStatus(this.statusListener);
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
    DnsChannel.actions.clear_logs(this.props.server_id);
  }

  render () {
    return (
      <Button key={this.props.key} onClick={this.onClickClear.bind(this)} >{this.props.text}</Button>
    );
  }
}
ClearLogButton.defaultProps = {text: "Clear Logs"};

export default {
  StartButton,
  StopButton,
  ClearLogButton,
  StatusMessage
};
