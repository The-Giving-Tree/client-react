import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import global from './global-reducer';
import auth from './auth-reducer';
import user from './user-reducer';

export default history =>
  combineReducers({
    global,
    auth,
    user,
    router: connectRouter(history)
  });
