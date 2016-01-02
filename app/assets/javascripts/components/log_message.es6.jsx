class LogMessage extends React.Component {
  render () {
    const hms = moment(this.props.created_at).format('HH:MM:ss');
    return (
      <tr>
        <td>{hms}</td>
        <td>{this.props.message}</td>
      </tr>
    );
  }
}

LogMessage.propTypes = {
  message: React.PropTypes.string
};
