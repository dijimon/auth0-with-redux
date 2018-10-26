import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './styles/index.css';

// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

serviceWorker.unregister();

const render = (Root, props: { app: App }, container = document.getElementById('App')) => {
  ReactDOM.render(document.getElementById('root'), container);
}

// reference to current app instance
let props = {
  app: new App()
};

render(App, props);

// if (__DEVELOPMENT__ && module.hot) {
//   const reload = (reloadStore = false) => () => {
//     if (reloadStore) {
//       // unload current App instance
//       props.app.unload();
//       // create a new App instance, hot reloading current App instance appState
//       props.app = new App(props.app.appState);
//     }

//     render(require('./root').default, props);
//   };

//   // if only react components updated, don't create a new store
//   module.hot.accept(['./root'], reload());

//   // if store changed, reload the app store allowing hot reload to work through chunking and lazy loading,
//   module.hot.accept(['./App'], reload(true));
// }