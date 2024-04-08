import { Configuration } from "./configuration";
import { ListeningTarget, ZRPeMessage } from "./types";

export class ProxyClient {
  private _socket?: WebSocket;
  private _targets: ListeningTarget[];
  private _listensTo: string[];
  private _handlers: Map<string, Function[]>;

  /**
   * The available targets to listen to.
   *
   * @readonly
   * @type {ListeningTarget[]}
   * @memberOf ProxyClient
   */
  public get availableTargets(): ListeningTarget[] {
    return JSON.parse(JSON.stringify(this._targets));
  }

  /**
   * The targets the client listens to.
   *
   * @readonly
   * @type {string[]}
   * @memberOf ProxyClient
   */
  public get listensTo(): string[] {
    return [...this._listensTo];
  }

  public constructor(private readonly config: Configuration) {
    this._handlers = new Map();
    this._targets = [];
    this._listensTo = [];
  }

  /**
   * Connect to the proxy server.
   *
   * @memberOf ProxyClient
   */
  public async connect() {
    this._socket = new WebSocket(this.config.proxyUrl);
    this._targets = [];
    this._listensTo = [];
    this._socket.onopen = () => {
      this._socket!.send("!dashboard");
      this._handlers.get("open")?.forEach((h) => h());
    };
    this._socket.onmessage = (event) => this.handleMessage(event);
    this._socket.onerror = (event) =>
      this._handlers.get("error")?.forEach((h) => h(event));
    this._socket.onclose = (event) =>
      this._handlers.get("close")?.forEach((h) => h(event));
  }

  private handleMessage(event: MessageEvent) {
    const msg = event.data.toString() as string;
    if (msg.startsWith("!targets,")) {
      // handle an incoming targets message
      this._targets = JSON.parse(msg.substr("!targets,".length));
      this._handlers
        .get("targetsUpdated")
        ?.forEach((h) => h(this.availableTargets));
    } else if (msg.startsWith("[")) {
      // handle an incoming masked ZRO message
      const [header, ...payload] = msg.substring(1).split("]");
      const [gameId, sender, receiver] = header.split(";");
      const zrpMessage = payload.join("]");

      this._handlers.get("message")?.forEach((h) =>
        h({
          gameId: parseInt(gameId),
          sender: parseInt(sender),
          receiver: parseInt(receiver),
          zrpMessage,
        })
      );
    }
  }

  /**
   * Listen to the given target.
   *
   * @param {ZRPeMessage} message
   * @memberOf ProxyClient
   */
  public async listen(targetId: string) {
    if (this._listensTo.includes(targetId)) {
      return;
    }
    if (!this._socket || this._socket.readyState !== WebSocket.OPEN) {
      throw new Error("Socket not connected");
    }
    this._socket.send(`!listen,${targetId}`);
  }

  /**
   * Stop listening to the given target.
   *
   * @param {string} targetId
   * @memberOf ProxyClient
   */
  public async unlisten(targetId: string) {
    if (!this._listensTo.includes(targetId)) {
      return;
    }
    if (!this._socket || this._socket.readyState !== WebSocket.OPEN) {
      throw new Error("Socket not connected");
    }
    this._socket.send(`!unlisten,${targetId}`);
  }

  /**
   * Register a handler for the given event.
   *
   * @param {"open"} event
   * @param {Function} handler
   *
   * @memberOf ProxyClient
   */
  public on(event: "open", handler: () => void): void;
  public on(
    event: "targetsUpdated",
    handler: (newTargets: ListeningTarget[]) => void
  ): void;
  public on(event: "message", handler: (msg: ZRPeMessage) => void): void;
  public on(event: "error", handler: (event: Event) => void): void;
  public on(event: "close", handler: (event: CloseEvent) => void): void;
  public on(event: string, handler: Function) {
    if (!this._handlers.has(event)) {
      this._handlers.set(event, []);
    }

    this._handlers.get(event)!.push(handler);
  }

  /**
   * Remove a handler for the given event.
   *
   * @param {string} event
   * @param {Function} handler
   * @returns
   *
   * @memberOf ProxyClient
   * */
  public off(event: string, handler: Function) {
    if (!this._handlers.has(event)) {
      return;
    }

    const handlers = this._handlers.get(event)!;
    const index = handlers.indexOf(handler);

    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }
}
