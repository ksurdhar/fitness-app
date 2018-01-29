import { combineReducers } from "redux";

import auth from "./auth";
import workouts from "./workouts";

const reducers = combineReducers({
  auth,
  workouts
});

export default reducers;
