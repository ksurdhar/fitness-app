import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button
} from 'react-native'
import Input from './reusable/input'
import PressCapture from './reusable/pressCapture'
import { commonStyles, COLORS } from './reusable/styles'
import firebase from 'firebase'
import { login, loginFailed } from '../redux/actions/authActions.js'
import { addWorkoutSuccess, removeWorkoutSuccess, recievedWorkouts } from '../redux/actions/workoutActions'
import { addSessionSuccess, removeSessionSuccess, recievedSessions } from '../redux/actions/sessionActions'

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
  }

  onLogin(e) {
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
        this.props.dispatchLogin(user)
      })
      .catch(error => {
        console.log("login failed: " + error)
      })
  }

  onSignUp(e) {
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

  onSubmitForm(e) {
    e.preventDefault()

    switch (this.state.action) {
      case LOGIN:
        return this.onLogin(e)
      case SIGNUP:
        return this.onSignUp(e)
    }
  }

  onToggleAction(e) {
    e.preventDefault()

    this.setState({ action: this.state.action === LOGIN ? SIGNUP : LOGIN })
  }

  handleCapture() {
    this.emailInput && this.emailInput.blur()
    this.passwordInput && this.passwordInput.blur()
  }

  render() {
    return (
      <PressCapture onPress={this.handleCapture}>
        <View style={[commonStyles.staticView]}>
          <Text style={[commonStyles.headerFont, { marginTop: 70, marginBottom: 40, textAlign:'center', color: COLORS.gray5 }]}>
            wizard fitness
          </Text>
          <Input
            labelText={'Email'}
            value={this.state.email}
            onChangeText={ text => this.setState({ email: text })}
            autoFocus={true}
            ref={(element) => { this.emailInput = element }}
            small={true}
          />
          <Input
            labelText={'Password'}
            value={this.state.password}
            onChangeText={ text => this.setState({ password: text })}
            secureTextEntry={true}
            ref={(element) => { this.passwordInput = element }}
            small={true}
          />

          <View style={{flexDirection: 'row'}}>
            <Button
              color='dodgerblue'
              onPress={e => this.onSubmitForm(e)}
              title={this.state.action}
            />
            <Button
              color='dodgerblue'
              onPress={e => this.onToggleAction(e)}
              title={this.state.action === LOGIN ? SIGNUP : LOGIN}
            />
          </View>
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
