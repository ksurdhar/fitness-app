import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { TabNavigator } from 'react-navigation'
import { Provider, connect } from 'react-redux'
import Navigator from './Navigator'
import store from './redux/store'
import LoginScreen from './components/LoginScreen'
import DemoScreen from './components/DemoScreen'
import Toast from './components/toast'

import { addWorkoutSuccess, removeWorkoutSuccess, recievedWorkouts, updateWorkoutSuccess } from './redux/actions/workoutActions'
import { addSessionSuccess, removeSessionSuccess, recievedSessions, updateSessionSuccess } from './redux/actions/sessionActions'
import { addNotificationSuccess, removeNotificationSuccess, recievedNotifications, updateNotificationSuccess } from './redux/actions/notificationActions'
import * as UserActions from './redux/actions/userActions'
import { rootRef } from './firebase.js'

import { common, DYNAMIC } from './components/reusable/common'

import Config from 'react-native-config'
import config from '../config'

function addListeners(userID) {
  console.log('ADDING LISTENERS', userID)
  // WORKOUTS
  const workoutsRef = rootRef.child(`workouts/${userID}`)
  workoutsRef.on('child_added', (snapshot) => {
    store.dispatch(addWorkoutSuccess(snapshot.val()))
  })
  workoutsRef.on('child_removed', (snapshot) => {
    store.dispatch(removeWorkoutSuccess(snapshot.val()))
  })
  workoutsRef.on('child_changed', (snapshot) => {
    store.dispatch(updateWorkoutSuccess(snapshot.val()))
  })
  workoutsRef.once('value', (snapshot) => {
    store.dispatch(recievedWorkouts(snapshot.val()))
  })
  //SESSIONS
  const sessionsRef = rootRef.child(`sessions/${userID}`)
  sessionsRef.on('child_added', (snapshot) => {
    store.dispatch(addSessionSuccess(snapshot.val()))
  })
  sessionsRef.on('child_removed', (snapshot) => {
    store.dispatch(removeSessionSuccess(snapshot.val()))
  })
  sessionsRef.on('child_changed', (snapshot) => {
    store.dispatch(updateSessionSuccess(snapshot.val()))
  })
  sessionsRef.once('value', (snapshot) => {
    store.dispatch(recievedSessions(snapshot.val()))
  })
  // NOTIFICATIONS
  const notificationsRef = rootRef.child(`notifications/${userID}`)
  notificationsRef.on('child_added', (snapshot) => {
    store.dispatch(addNotificationSuccess(snapshot.val()))
  })
  notificationsRef.on('child_removed', (snapshot) => {
    store.dispatch(removeNotificationSuccess(snapshot.val()))
  })
  notificationsRef.on('child_changed', (snapshot) => {
    store.dispatch(updateNotificationSuccess(snapshot.val()))
  })
  notificationsRef.once('value', (snapshot) => {
    store.dispatch(recievedNotifications(snapshot.val()))
  })
  // USERS
  const usersRef = rootRef.child(`users`)
  usersRef.on('child_added', (snapshot) => {

    store.dispatch(UserActions.addUserSuccess(snapshot.val()))
  })
  usersRef.on('child_changed', (snapshot) => {
    store.dispatch(UserActions.updateUserSuccess(snapshot.val()))
  })
  usersRef.once('value', (snapshot) => {
    store.dispatch(UserActions.recievedUser(snapshot.val()))
  })
}

class Index extends Component {


  render() {
    // UNCOMMENT TO WORK ON DEMO
    // if (this.state.fontLoaded) {
    //   return (
    //     <Provider store={store}>
    //       <DemoScreen />
    //     </Provider>
    //   )
    // } else {
    //   return null
    // }

    if (this.props.isLoggedIn) {
      return (
        <View style={{flex: 1}}>
          <Toast />
          <Navigator />
        </View>
      )
    } else {
      return (
        <View style={{flex: 1}}>
          <Toast />
          <LoginScreen />
        </View>
      )
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.user.userID && this.props.user.userID) {
      addListeners(this.props.user.userID)
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user
  }
}

export default connect(mapStateToProps)(Index)
