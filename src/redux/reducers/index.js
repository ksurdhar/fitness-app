import { combineReducers } from 'redux';

import auth from './auth';
import workouts from './workouts';
import sessions from './sessions';

const reducers = combineReducers({
  auth,
  workouts,
  sessions,
});

const rootReducer = ( state, action ) => {
  if ( action.type === 'LOGOUT' ) {
    state = undefined;
  }

  return reducers(state, action)
}

export default rootReducer;
