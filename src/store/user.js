import { getCredentials, saveCredentials, removeCredentials } from '../utils/token';

export const LOGIN = 'LOGIN';
export const login = credentials => dispatch => {
  console.log('login saveCredentials');
  saveCredentials(credentials);
  console.log('login dispatch action LOGIN');
  dispatch({ type: LOGIN, payload: credentials });
};

export const LOGOUT = 'LOGOUT';
export const logout = lock => dispatch => {
  removeCredentials();
  dispatch({ type: LOGOUT });
  console.log('lock.logout...');
  lock.logout();
};

const initialState = () => {
  const credentials = getCredentials();

  return credentials
    ? {
        loggedIn: true,
        ...credentials,
      }
    : {
        loggedIn: false,
        idToken: null,
        accessToken: null,
      };
};

export default (state = initialState(), action) => {
  switch (action.type) {
    case LOGIN:
      console.log('LOGIN reducer');
      return { ...state, loggedIn: true, ...action.payload };
    case LOGOUT:
      return { ...initialState() };
    default:
      return state;
  }
};
