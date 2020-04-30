import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { logger } from 'redux-logger';
import rootSaga from './sagas/root-saga';
import createRootReducer from './reducers/root-reducer';
import { routerMiddleware } from 'connected-react-router';

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

export default function configureStore(preloadedState) {
  let store;

  if (process.env.NODE_ENV !== 'development') {
    store = createStore(
      createRootReducer(history), // root reducer with router state
      preloadedState,
      compose(applyMiddleware(sagaMiddleware, logger, routerMiddleware(history)))
    );
  } else {
    store = createStore(
      createRootReducer(history), // root reducer with router state
      preloadedState,
      compose(applyMiddleware(sagaMiddleware, routerMiddleware(history)))
    );
  }

  sagaMiddleware.run(rootSaga);

  return store;
}
