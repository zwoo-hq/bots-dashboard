import { WebSocketServer, type WebSocket } from "ws";
import { ConnectionType, DistributorMeta } from "./src/types";

class Connection {
  constructor(
    public readonly id: string,
    public readonly ws: WebSocket,
    public type: ConnectionType = "" as ConnectionType,
    public listens: string[] = [],
    public data?: DistributorMeta
  ) {}
}

const ALL_CONNECTIONS: Record<string, Connection> = {};
const wss = new WebSocketServer({ port: 9072 });

wss.on("connection", (ws) => {
  const id = Math.random().toString(36).substring(2, 7);
  const conn = new Connection(id, ws);
  ALL_CONNECTIONS[id] = conn;
  console.log(`${id} connected`);

  ws.on("message", (message) => {
    console.log(`${id} -> ${message}`);
    try {
      const data = message.toString();
      if (data.startsWith("!")) {
        processCommand(data, conn);
      } else if (data.startsWith("[")) {
        processMessage(data, conn);
      } else {
        console.log(`${id} unknown message type`, data);
      }
    } catch (err) {
      console.log(`${id} handler error: ${err}`);
    }
  });

  ws.on("close", () => {
    delete ALL_CONNECTIONS[id];
    console.log(`${id} disconnected`);
  });

  ws.on("error", (err) => {
    delete ALL_CONNECTIONS[id];
    console.log(`${id} errored: ${err}`);
    ws.close();
  });
});

/**
 * Handle an incoming command
 *
 * @param {string} command
 * @param {Connection} conn
 */
function processCommand(command: string, conn: Connection) {
  command = command.substring(1); // remove leading "!"
  if (command.startsWith("distribution")) {
    // register connection as a distributor
    conn.type = ConnectionType.Distributer;
    conn.data = JSON.parse(command.substring("distribution".length + 1));
    // notify all listeners of the new distributor
    Object.values(ALL_CONNECTIONS).forEach((c) => {
      if (c.type === ConnectionType.Listener) {
        sendTargets(c);
      }
    });
  } else if (command.startsWith("dashboard")) {
    // register connection as a listener
    conn.type = ConnectionType.Listener;
    conn.listens = [];
    // send all distributors to the listener
    sendTargets(conn);
  } else if (command.startsWith("listen")) {
    // listen to a distributor
    const id = command.substring("listen".length + 1);
    if (Object.values(ALL_CONNECTIONS).some((c) => c.data?.id === id)) {
      conn.listens.push(id);
    } else {
      console.log(`${conn.id} tried to listen to ${id} but it doesn't exist`);
    }
  } else if (command.startsWith("unlisten")) {
    // stop listening to a distributor
    const id = command.substring("unlisten".length + 1);
    const index = conn.listens.indexOf(id);
    if (index !== -1) {
      conn.listens.splice(index, 1);
    } else {
      console.log(`${conn.id} tried to unlisten to ${id} but it doesn't exist`);
    }
  } else {
    console.log(`${conn.id} unknown command: ${command}`);
  }
}

/**
 * sends all targets to a connection
 * @param {Connection} conn
 */
function sendTargets(conn: Connection) {
  const targets = Object.values(ALL_CONNECTIONS).filter(
    (c) => c.type === ConnectionType.Distributer
  );
  conn.ws.send(
    "!targets," + JSON.stringify(targets.map((target) => target.data))
  );
}

/**
 * Handle an incoming message
 *
 * @param {string} message
 * @param {Connection} conn
 */
function processMessage(message: string, conn: Connection) {
  if (conn.type === ConnectionType.Distributer) {
    // forward message to all listeners
    Object.values(ALL_CONNECTIONS)
      .filter((c) => c.type === ConnectionType.Listener)
      .forEach((c) => {
        if (conn.data?.id && c.listens.includes(conn.data.id)) {
          c.ws.send(message);
        }
      });
  } else {
    console.log(`${conn.id} tried to send a message but is not a distributor`);
  }
}
