import { Dispatch } from 'react';

export interface GlobalStateInterface {
  id: string,
  name: string,
  image:string,
  loggedIn: boolean,
  role: number,
  children?: React.ReactNode
}

export type ActionType = {
  type: string;
  payload?: any;
};

export type ContextType = {
  globalState: GlobalStateInterface;
  dispatch: Dispatch<ActionType>;
};
