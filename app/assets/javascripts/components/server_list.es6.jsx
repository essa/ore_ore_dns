class ServerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { servers: [], status: {} };
  }
  componentDidMount() {
    this.statusListener = (data)=>this.setState({status: data.status});
    App.dns.on('cable.dns.status', this.statusListener);
    $.get(`/fake_dns_servers.json`, (res) =>{
      this.setState({servers: res});
    });
  }
  componentWillUnmount() {
    App.dns.off('cable.dns.status', this.statusListener);
  }
  render () {
    const Button = window.ReactPure.Button;
    const Cell = window.ReactPure.Cell;
    const Table = window.ReactPure.Table;
    const servers = this.state.servers.map(s=>{
      const runningMessage = (s.id == this.state.status.server_id && this.state.status.running)?'running':'';

      return (
        <tr key={s.id}>
          <td>{s.name}</td>
          <td>{runningMessage}</td>
          <td>
            <StartButton server_id={s.id}>Start</StartButton>
            &nbsp;
            <Button href={`/fake_dns_servers/${s.id}`}>Show Console</Button>
              &nbsp;
            <Button href={`/fake_dns_servers/${s.id}/edit`}>Edit Config</Button>
          </td>
        </tr>
      );
    });
    return (
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th colSpan="3">Operation</th>
          </tr>
        </thead>

        <tbody>{servers}</tbody>
      </Table>

    );
  }
}

ServerList.propTypes = {
};
