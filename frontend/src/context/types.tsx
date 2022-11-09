import { Dispatch } from 'react';

export interface UserStateInterface {
  id: string,
  name?: string,
  image?: string,
  loggedIn: boolean,
  blockedList:object[],
  theaters: object[],
  email?: string,
  role: number
  children?: React.ReactNode
}

export interface GlobalStateInterface {
  user: UserStateInterface
}

export type ActionType = {
  type: string;
  payload?: any;
};

export type ContextType = {
  globalState: GlobalStateInterface;
  dispatch: Dispatch<ActionType>;
};
