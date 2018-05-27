// this file is duplicated by src/webApp.js because of the difference in
// entry points for web / mobile
import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./src/redux/store";

import Index from "./src/mainApp";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

export default App;
