import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./src/redux/store";

import Index from "./src/Index";

class WorkoutApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

export default WorkoutApp;
