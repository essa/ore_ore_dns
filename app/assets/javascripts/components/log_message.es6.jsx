class LogMessage extends React.Component {
  render () {
    console.log(this.props);
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
