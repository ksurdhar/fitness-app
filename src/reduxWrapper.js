import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";

import Index from "./mainApp";

class ReduxWrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

export default ReduxWrapper;
