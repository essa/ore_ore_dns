// HelloWorldWidget is an arbitrary name for any "dumb" component. We do not recommend suffixing
// all your dump component names with Widget.

import React, { PropTypes } from 'react';
import DnsChannel from '../startup/dns_channel';
import Button from './Button';
import Cell from './Cell';
import Table from './Table';
import moment from 'moment';

export default class Logs extends React.Component {
  constructor(props) {
   super(props);
   this.state = {log_messages: []};
  }

  componentDidMount() {
    console.log('componentDidMount', this);
    this.messageListner = this.onMessage.bind(this);
    DnsChannel.onMessage(this.messageListner);

    $.get(`/fake_dns_servers/${this.props.id}/log_messages`, (res) =>{
      this.setState({log_messages: res.log_messages});
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount', this);
    DnsChannel.offMessage(this.messageListner);
  }

  onMessage(data) {
    if (!this.state) {
      return ;
    }
    let m = this.state.log_messages;
    if (data.message == '__CLEAR__')
      m = [];
    else
      m.unshift(data);
    this.setState({log_messages: m});
  };


  render () {
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
