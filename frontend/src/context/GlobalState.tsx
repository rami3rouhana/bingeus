import React, { createContext, useReducer } from "react";
import { setupInterceptorsTo } from "../components/Interceptors";
import Reducer from './reducer'
import axios from 'axios'
setupInterceptorsTo(axios);
const user = { id: '', name: '', image: '', currentTheater: '', email: '', blockedList: [], theaters: [], allTheaters: [], loggedIn: false, jwt: '' };
const intialeState = {
  user,
  error: null,
}

export interface GlobalStateInterface {
  id: string,
  name: string,
  email: string,
  loggedIn: boolean,
  currentTheater: string,
  blockedList: object[],
  allTheaters: object[],
  theaters: object[],
  jwt: string,
  image: string,
  children?: React.ReactNode
}

export interface State {
  user: object;
}

interface EditValues {
  value: string,
  changed: boolean
}


interface GlobalContext {
  state: State,
  user: GlobalStateInterface,
  login: (data: object) => Promise<void>,
  signup: (data: object) => Promise<void>,
  logout: () => void,
  auth: () => Promise<void>,
  unblock: (_id: string) => Promise<void>,
  getUserTheaters: () => Promise<void>,
  addTheater: (data: object) => Promise<void>,
  uploadImage: (data: any) => Promise<void>,
  getAllTheaters: () => Promise<void>,
  editUser: (name?: EditValues, email?: EditValues, password?: EditValues, image?: FormData) => Promise<void>
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
      user.name = res.data.user.name;
      user.id = res.data.user._id;
      user.email = res.data.user.email;
      user.image = res.data.user.image;
      user.blockedList = res.data.user.blockedList;
      user.jwt = res.data.token;
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

  const logout = () => {
    dispatch({
      type: 'LOGOUT',
    })
  }

  const addTheater = async (data: any) => {
    try {
      const res = await axios.post('theater/', data);
      dispatch({
        type: 'ADD_THEATER',
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: 'ERROR',
        payload: err
      })
    }
  }

  const auth = async () => {
    try {
      const res = await axios.get('auth');
      user.name = res.data.user.name;
      user.id = res.data.user._id;
      user.email = res.data.user.email;
      user.image = res.data.user.image;
      user.blockedList = res.data.user.blockedList;
      user.jwt = res.data.token;
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

  const editUser = async (name?: EditValues, email?: EditValues, password?: EditValues) => {
    try {
      const data = {}
      if (name?.changed)
        data['name'] = name.value
      if (email?.changed)
        data['email'] = email.value
      if (password?.changed)
        data['password'] = password.value

      await axios.patch('profile', data);

      dispatch({
        type: 'EDIT_PROFILE',
        payload: data
      })
    } catch (err: any) {
      dispatch({
        type: 'ERROR',
        payload: err
      })
    }
  }

  const getUserTheaters = async () => {
    try {
      const res = await axios.get('/theater/user');
      dispatch({
        type: 'GET_THEATERS',
        payload: res.data
      })
    } catch (err: any) {
      dispatch({
        type: 'ERROR',
        payload: err
      })
    }
  }

  const getAllTheaters = async () => {
    try {
      const res = await axios.get('/theater/all');
      dispatch({
        type: 'GET_ALL_THEATERS',
        payload: res.data
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
      user.email = res.data.email;
      user.image = res.data.image;
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

  const unblock = async (userId: string) => {
    try {
      await axios.get(`unblock/${userId}`);
      dispatch({
        type: 'UNBLOCK',
        payload: userId
      })
    } catch (err: any) {
      dispatch({
        type: 'ERROR',
        payload: err
      })
    }
  }

  const uploadImage = async (data: any) => {
    try {
      const res = await axios.post(`upload`, data);
      dispatch({
        type: 'UPLOAD_IMAGE',
        payload: res.data
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
      logout,
      addTheater,
      uploadImage,
      signup,
      auth,
      editUser,
      unblock,
      getAllTheaters,
      getUserTheaters,
      state,
    }}>
      {children}
    </GlobalStateContext.Provider>
  )
}
