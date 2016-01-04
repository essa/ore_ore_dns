class ServerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { servers: [], status: {} };
  }
  componentDidMount() {
    App.dns_event.on('cable.dns.status', (data)=>{
      this.setState({status: data.status});
    });
    $.get(`/fake_dns_servers.json`, (res) =>{
      console.log(res);
      this.setState({servers: res});
    });
  }
  render () {
    const Button = window.ReactPure.Button;
    const Cell = window.ReactPure.Cell;
    const Table = window.ReactPure.Table;
    const servers = this.state.servers.map(s=>{
      const runningMessage = (s.id == this.state.status.server_id && this.state.status.running)?'running':'';

      return (
        <tr>
          <td>{s.name}</td>
          <td>{runningMessage}</td>
          <td>
            <StartButton server_id={s.id}>Start</StartButton>
            &nbsp;
            <Button href={`/fake_dns_servers/1`}>Show Console</Button>
              &nbsp;
            <Button href={`/fake_dns_servers/1/edit`}>Edit Config</Button>
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
            <th colspan="3">Operation</th>
          </tr>
        </thead>

        <tbody>{servers}</tbody>
      </Table>

    );
  }
}

ServerList.propTypes = {
};
