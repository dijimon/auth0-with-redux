import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import userReducer from './user';

const logger = createLogger({
  duration: true,
  collapsed: true,
  colors: {
    title: action => {
      return action.error ? 'firebrick' : 'deepskyblue';
    },
    prevState: () => '#1C5FAF',
    action: () => '#149945',
    nextState: () => '#A47104',
    error: () => '#ff0005',
  },
});

const reducers = combineReducers({
  user: userReducer,
});

export default function initStore() {
  const store = createStore(reducers, applyMiddleware(thunkMiddleware, logger));
  console.log('store', store);
  console.log('process.env.NODE_ENV = ', process.env.NODE_ENV);
  console.log('process.env.PUBLIC_URL = ', process.env.PUBLIC_URL);
  if (process.env.NODE_ENV === 'development' && window !== undefined) {
    window.store = store;
  }

  return store;
}
