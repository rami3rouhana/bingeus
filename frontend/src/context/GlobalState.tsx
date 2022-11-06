import React, { createContext, useReducer } from "react";
import { setupInterceptorsTo } from "../components/Interceptors";
import Reducer from './reducer'
import axios from 'axios'
setupInterceptorsTo(axios);
const user = { id: '', name: '', loggedIn: false, jwt: '' };
const intialeState = {
  error: null,
}

export interface GlobalStateInterface {
  id: string,
  name: string,
  loggedIn: boolean,
  jwt: string,
  children?: React.ReactNode
}

export interface State {
  user: object;
}


interface GlobalContext {
  state: State,
  user: GlobalStateInterface,
  login: (data: object) => Promise<void>,
  signup: (data: object) => Promise<void>
}

export const GlobalStateContext = createContext({} as GlobalContext)

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
  value = {} as GlobalStateInterface,
}: {
  children: React.ReactNode;
  value?: Partial<GlobalStateInterface>;
}) => {

  const [state, dispatch] = useReducer(Reducer, intialeState)

  const login = async (data: object) => {
    try {
      const res = await axios.post('login', data);
      user.name = res.data.name;
      user.jwt = res.data.jwt;
      user.loggedIn = true;
      dispatch({
        type: 'LOGIN',
        payload: user
      })
    } catch (err: any) {
      dispatch({
        type: 'ERROR',
        payload: err
      })
    }
  }

  const signup = async (data: object) => {
    try {
      const res = await axios.post('signup', data);
      user.name = res.data.name;
      user.jwt = res.data.jwt;
      user.loggedIn = true;
      dispatch({
        type: 'REGISTER',
        payload: user
      })
    } catch (err: any) {
      dispatch({
        type: 'ERROR',
        payload: err
      })
    }
  }


  return (
    <GlobalStateContext.Provider value={{
      user,
      login,
      signup,
      state,
    }}>
      {children}
    </GlobalStateContext.Provider>
  )
}
