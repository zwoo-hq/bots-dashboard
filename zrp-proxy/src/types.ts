/**
 * the connection type of a websocket connection
 */
export enum ConnectionType {
  Distributer = "distribution",
  Listener = "dashboard",
}

/**
 * the meta data of a distributor
 */
export type DistributorMeta = {
  /**
   * the id of the distributor
   */
  id: string;

  /**
   * the url of the distributor
   */
  instance: string;
};
