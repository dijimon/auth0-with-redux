import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from 'react-private-route';
import { Provider } from 'react-redux';
import App from './components/app';
import './index.css';
import initStore from './store';
import registerServiceWorker from './registerServiceWorker';

//Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const store = initStore();

console.log('store.getState().user.loggedIn', store.getState().user.loggedIn);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/login" component={App} />
        <PrivateRoute
          exact
          path="/"
          component={Home}
          isAuthenticated={store.getState().user.loggedIn /* this method returns true or false */}
        />
        <PrivateRoute
          path="/home"
          component={Home}
          isAuthenticated={store.getState().user.loggedIn /* this method returns true or false */}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
