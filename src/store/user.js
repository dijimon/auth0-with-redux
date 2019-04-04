import { getCredentials, saveCredentials, removeCredentials } from '../utils/token';

export const LOGIN = 'LOGIN';
export const login = credentials => dispatch => {
  saveCredentials(credentials);
  dispatch({ type: LOGIN, payload: credentials });
};

export const LOGOUT = 'LOGOUT';
export const logout = () => dispatch => {
  removeCredentials();
  dispatch({ type: LOGOUT });
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
      return { ...state, loggedIn: true, ...action.payload };
    case LOGOUT:
      return { ...initialState() };
    default:
      return state;
  }
};
