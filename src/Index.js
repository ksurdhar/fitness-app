import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { TabNavigator } from 'react-navigation'
import { Provider, connect } from 'react-redux'
import Navigator from './Navigator'
import store from './redux/store'
import LoginScreen from './components/LoginScreen'
import DemoScreen from './components/DemoScreen'
import { Font } from 'expo'

import Config from 'react-native-config'
import config from '../config'

INDEX_STATE = {
  fontLoaded: false
}

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = INDEX_STATE
  }

  render() {
    // console.log('Config', Config)
    // console.log('env value', process.env)
    // console.log('process value', process)
    if (this.state.fontLoaded) {
      return (
        <Provider store={store}>
          <DemoScreen />
        </Provider>
      )
    } else {
      return null
    }
    // if (this.state.fontLoaded && this.props.isLoggedIn) {
    //   return (
    //     <Provider store={store}>
    //       <Navigator />
    //     </Provider>
    //   )
    // } else if (this.state.fontLoaded) {
    //   return (
    //     <Provider store={store}>
    //       <LoginScreen />
    //     </Provider>
    //   )
    // } else {
    //   return null
    // }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'raleway-bold': require('../assets/fonts/Raleway-Bold.ttf'),
      'rubik-medium': require('../assets/fonts/Rubik-Medium.ttf')
    })
    this.setState({
      fontLoaded: true
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  }
}

export default connect(mapStateToProps)(Index)
