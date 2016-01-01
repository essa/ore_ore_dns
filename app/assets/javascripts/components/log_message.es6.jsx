class LogMessage extends React.Component {
  render () {
    return (
      <tr>
        <td>{this.props.created_at}</td>
        <td>{this.props.message}</td>
      </tr>
    );
  }
}

LogMessage.propTypes = {
  message: React.PropTypes.string
};
