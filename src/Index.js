import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { TabNavigator } from "react-navigation";
import { Provider, connect } from "react-redux";
import Navigator from "./Navigator";
import store from "./redux/store";
import LoginScreen from "./components/LoginScreen";

import config from '../config';

class Index extends Component {
  render() {
    if (this.props.isLoggedIn) {
      return (
        <Provider store={store}>
          <Navigator />
        </Provider>
      );
    } else {
      return (
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

export default connect(mapStateToProps)(Index);
