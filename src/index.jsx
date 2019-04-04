import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from 'react-private-route';
import { Provider } from 'react-redux';

//Components
import history from './components/history';
import App from './components/App';
import initStore from './store';

//Styles
import './index.css';

// import registerServiceWorker from './registerServiceWorker';

//Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const store = initStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/login" component={App} />
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
//registerServiceWorker();
