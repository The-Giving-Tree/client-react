import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/browser';

import { ConnectedRouter } from 'connected-react-router';
import configureStore from './store/configure-store';
import { history } from './store/configure-store';

require('dotenv').config();
const store = configureStore();

Sentry.init({ 
  dsn: 'https://a994116c7f4a426fa4f35e5bbf6f223e@sentry.io/1848751'
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
