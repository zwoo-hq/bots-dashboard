/**
 * Meta data of a distributor.
 */
export type ListeningTarget = {
  id: string;
  instance: string;
};

export type ZRPeMessage = {
  gameId: number;
  sender: number;
  receiver: number;
  zrpMessage: string;
};
