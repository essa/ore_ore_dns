var Logs = React.createClass({
  componentDidMount: function() {
    console.log('didMount', this, this.props);
    $.get(`/fake_dns_servers/${this.props.id}/log_messages`, (res) =>{
      console.log(res);
      this.setState({log_messages: res.log_messages});
    });
  },

  propTypes: {
    name: React.PropTypes.string
  },

  render: function() {
    return (
      <div>
        <div>Name: {this.props.name}</div>
      </div>
    );
  }
});
