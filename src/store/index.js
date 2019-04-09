import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import userReducer from './user';

const __DEV__ = process.env.PROJECT_ENV === 'development';

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

const middleware = [thunk];

if (__DEV__) {
  middleware.push(logger);
}

// Environment check
const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = __DEV__ && devtools ? devtools : compose;

const reducers = combineReducers({
  user: userReducer,
});

export default function initStore() {
  const store = createStore(reducers, composeEnhancers(applyMiddleware(...middleware)));

  console.log('process.env.PROJECT_ENV = ', process.env.PROJECT_ENV);
  console.log('process.env.PUBLIC_URL = ', process.env.PUBLIC_URL);

  if (__DEV__ && window !== undefined) {
    window.store = store;
  }

  return store;
}
