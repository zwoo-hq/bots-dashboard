import { ZRPeMessage } from "./types";

/**
 * Create a filter for messages for a specific game.
 *
 * @param gameId the game id to filter for
 * @param handler the handler to call if the message is for the game
 * @returns a function that can be used as a message handler
 */
export const forGame =
  (gameId: number, handler: (msg: ZRPeMessage) => void) =>
  (msg: ZRPeMessage) => {
    if (msg.gameId === gameId) {
      handler(msg);
    }
  };
