import { ActionType, GlobalStateInterface } from './types';
import { initialState } from './index';

const Reducer = (state: GlobalStateInterface, action: ActionType): any => {
  const user = state.user;
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'REGISTER':
      return {
        ...state,
        user: action.payload,
      };
    case 'EDIT_PROFILE':
      for (let updated in action.payload) {
        user[updated] = action.payload[updated];
      }
      return {
        ...state,
        user: user,
      };
    case 'UPLOAD_IMAGE':
      user.image = action.payload.path;
      return {
        ...state,
        user: user,
      };
    case 'UNBLOCK':
      const userBlockedList = state.user.blockedList;
      const blockedList = userBlockedList.filter((e: any) => e.userId !== action.payload);
      user['blockedList'] = blockedList;
      return {
        ...state,
        blockedList: blockedList,
      };
    case 'GET_THEATERS':
      user.theaters = action.payload;
      return {
        ...state,
        user: user,
      };
    case 'ADD_THEATER':
      user.theaters = [...user.theaters, action.payload];
      return {
        ...state,
        user: user,
      };
    case 'GET_ALL_THEATERS':
      user.allTheaters = action.payload;
      return {
        ...state,
        user: action.payload,
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return initialState;
    default:
      return state;
  }
};

export default Reducer;