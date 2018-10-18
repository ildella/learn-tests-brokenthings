import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class SocketIoComponent extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "localhost:4444"
      // endpoint: "localhost/websocket"
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("intro", data => this.setState({ response: data }));
  }
  render() {
    // console.log(response);
    const { response } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        {response
          ? <p>
              message -> {response}
            </p>
          : <p>Loading...</p>}
      </div>
    );
  }
}
export default SocketIoComponent;