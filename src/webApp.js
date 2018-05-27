// this file is a duplicate of App.js, but is compiled by babel in the webpack config
// after being imported by index.js, which is the web entry point
import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";

import Index from "./mainApp";

class WebApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

export default WebApp;
