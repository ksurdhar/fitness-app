import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { TabNavigator } from 'react-navigation'
import { Provider, connect } from 'react-redux'
import Navigator from './Navigator'
import store from './redux/store'
import LoginScreen from './components/LoginScreen'
import DemoScreen from './components/DemoScreen'

import Config from 'react-native-config'

import config from '../config'

class Index extends Component {
  render() {
    // console.log('Config', Config)
    // console.log('env value', process.env)
    // console.log('process value', process)

    return (
      <Provider store={store}>
        <DemoScreen />
      </Provider>
    )
    if (this.props.isLoggedIn) {
      return (
        <Provider store={store}>
          <Navigator />
        </Provider>
      )
    } else {
      return (
        <Provider store={store}>
          <LoginScreen />
        </Provider>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  }
}

export default connect(mapStateToProps)(Index)
