import { combineReducers } from "redux";

import auth from "./auth";
import workouts from "./workouts";

const reducers = combineReducers({
  auth,
  workouts
});

const rootReducer = ( state, action ) => {
  if ( action.type === 'LOGOUT' ) {
    state = undefined;
  }

  return reducers(state, action)
}

export default rootReducer;
