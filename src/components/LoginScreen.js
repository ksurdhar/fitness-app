import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { MaterialIcons } from '@expo/vector-icons'
import { Permissions, Notifications } from 'expo'

import Button from './reusable/button'
import Input from './reusable/input'
import PressCapture from './reusable/pressCapture'
import { common, COLORS } from './reusable/common'

import firebase from 'firebase'
import { login, loginFailed } from '../redux/actions/authActions.js'
import { addWorkoutSuccess, removeWorkoutSuccess, recievedWorkouts } from '../redux/actions/workoutActions'
import { addSessionSuccess, removeSessionSuccess, recievedSessions } from '../redux/actions/sessionActions'
import { addNotificationSuccess, removeNotificationSuccess, recievedNotifications, updateNotificationSuccess } from '../redux/actions/notificationActions'

import config from '../../config.js'
import store from '../redux/store.js'
import { firebaseApp, rootRef } from '../firebase.js'

const LOGIN = "Login"
const SIGNUP = "Sign Up"

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      action: LOGIN,
      email: "",
      password: ""
    }

    if (config.DEV_MODE) {
      this.state.email = 'admin@gmail.com'
      this.state.password = 'password'
    }
    this.handleCapture = this.handleCapture.bind(this)
    this.onLogin = this.onLogin.bind(this)
    this.onSignUp = this.onSignUp.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.registerNotifications = this.registerNotifications.bind(this)
  }

  async registerNotifications () {
    console.log('registering')
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    )
    let finalStatus = existingStatus

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      console.log('not granted')
      return
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync()
    console.log('RECEIVED TOKEN', token)
  }

  onLogin() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        // WORKOUTS
        const workoutsRef = rootRef.child('workouts').orderByChild('userID').equalTo(user.uid)
        workoutsRef.on('child_added', (snapshot) => {
          store.dispatch(addWorkoutSuccess(snapshot.val()))
        })
        workoutsRef.on('child_removed', (snapshot) => {
          store.dispatch(removeWorkoutSuccess(snapshot.val()))
        })
        workoutsRef.once('value', (snapshot) => {
          store.dispatch(recievedWorkouts(snapshot.val()))
        })
        //SESSIONS
        const sessionsRef = rootRef.child('sessions').orderByChild('userID').equalTo(user.uid)
        sessionsRef.on('child_added', (snapshot) => {
          store.dispatch(addSessionSuccess(snapshot.val()))
        })
        sessionsRef.on('child_removed', (snapshot) => {
          store.dispatch(removeSessionSuccess(snapshot.val()))
        })
        sessionsRef.once('value', (snapshot) => {
          store.dispatch(recievedSessions(snapshot.val()))
        })
        // NOTIFICATIONS
        const notificationsRef = rootRef.child('notifications').orderByChild('userID').equalTo(user.uid)
        notificationsRef.on('child_added', (snapshot) => {
          store.dispatch(addNotificationSuccess(snapshot.val()))
        })
        notificationsRef.on('child_removed', (snapshot) => {
          store.dispatch(removeNotificationSuccess(snapshot.val()))
        })
        notificationsRef.on('child_changed', (snapshot) => {
          console.log('CHILD UPDATED', snapshot.val())
          store.dispatch(updateNotificationSuccess(snapshot.val()))
        })
        notificationsRef.once('value', (snapshot) => {
          store.dispatch(recievedNotifications(snapshot.val()))
        })

        // NOTIFICATION REGISTRATION
        // this.registerNotifications()
        this.props.dispatchLogin(user)
      })
      .catch(error => {
        console.log("login failed: " + error)
      })
  }

  onSignUp() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.props.dispatchLogin(user)
      })
      .catch(error => {
        console.log("signup failed: " + error)
      })
  }

  onSubmit() {
    switch (this.state.action) {
      case LOGIN:
        return this.onLogin()
      case SIGNUP:
        return this.onSignUp()
    }
  }

  onToggleAction() {
    this.setState({ action: this.state.action === LOGIN ? SIGNUP : LOGIN })
  }

  handleCapture() {
    this.emailInput && this.emailInput.blur()
    this.passwordInput && this.passwordInput.blur()
  }

  // TODO REPLACE SIGN UP BUTTON WITH LINK
  // <Button
  //   style={{marginLeft: 10}}
  //   onPress={e => this.onToggleAction(e)}
  //   value={this.state.action === LOGIN ? SIGNUP : LOGIN}
  // />

  render() {
    const emailLabel = (
      <Text style={{
        fontFamily: 'rubik-medium',
        fontSize:20,
        color: COLORS.gray7
      }}>
        Email
      </Text>
    )
    const passwordLabel = (
      <Text style={{
        fontFamily: 'rubik-medium',
        fontSize:20,
        color: COLORS.gray7
      }}>
        Password
      </Text>
    )

    return (
      <PressCapture onPress={this.handleCapture}>
        <View style={[common.staticView]}>
          <KeyboardAwareScrollView
            style={{flex:1, justifyContent: 'start'}}
          >
            <Text style={[common.headerFont, { marginTop: 70, marginBottom: 50, textAlign:'center', color: COLORS.gray5 }]}>
              MIGHTY
            </Text>
            <Input
              label={emailLabel}
              value={this.state.email}
              onChangeText={ text => this.setState({ email: text })}
              autoFocus={true}
              ref={(element) => { this.emailInput = element }}
              fixedTrue={false}
              fontSize={24}
              animate={false}
            />
            <View style={{paddingTop: 40}}>
              <Input
                label={passwordLabel}
                value={this.state.password}
                onChangeText={ text => this.setState({ password: text })}
                secureTextEntry={true}
                ref={(element) => { this.passwordInput = element }}
                fixedTrue={false}
                fontSize={24}
                animate={false}
              />
            </View>
            <View style={[common.row, {marginTop: 50, marginBottom: 80}]}>
              <Button
                style={{width: 300}}
                onPress={() => this.onSubmit()}
                value={this.state.action}
                isEnabled={true}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </PressCapture>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 30,
    width: 300,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchLogin: user => {
      dispatch(login(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
