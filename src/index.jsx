import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/privateRoute';

//Components
import history from './components/history';
import App from './components/App';
import initStore from './store';

//Styles
import './index.scss';

import registerServiceWorker from './registerServiceWorker';

//Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const store = initStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/login" component={App} />
        <PrivateRoute exact path="/" component={Home} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
