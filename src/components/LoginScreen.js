import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Dimensions,
  Button,
  Image
} from 'react-native'
import firebase from 'firebase'
import Expo from 'expo'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { MaterialIcons } from '@expo/vector-icons'

import BasicButton from './reusable/basicButton'
import Input from './reusable/input'
import PressCapture from './reusable/pressCapture'
import { common, DYNAMIC } from './reusable/common'

import { login, loginFailed } from '../redux/actions/authActions.js'
import { addWorkoutSuccess, removeWorkoutSuccess, recievedWorkouts, updateWorkoutSuccess } from '../redux/actions/workoutActions'
import { addSessionSuccess, removeSessionSuccess, recievedSessions, updateSessionSuccess } from '../redux/actions/sessionActions'
import { addNotificationSuccess, removeNotificationSuccess, recievedNotifications, updateNotificationSuccess } from '../redux/actions/notificationActions'
import * as UserActions from '../redux/actions/userActions'

import config from '../../config.js'
import store from '../redux/store.js'
import { firebaseApp, rootRef } from '../firebase.js'

const googleURI = Expo.Asset.fromModule(require('../../assets/images/test.png')).uri
const facebookURI = Expo.Asset.fromModule(require('../../assets/images/fbwhite.png')).uri

const LOGIN = "I Already Have An Account"
const SIGNUP = "Sign Up"

firebase.auth().onAuthStateChanged((user) => {
  console.log('AUTH CHANGED')
  if (user != null) {
    console.log("We are authenticated now!", user)
  }
})

async function signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      iosClientId: config.IOS_CLIENT_ID,
      scopes: ['profile', 'email'],
    })
    if (result.type === 'success') {
      return result
    } else {
      return {cancelled: true}
    }
  } catch(e) {
    console.log('error signing into google', e)
  }
}

async function signInWithFBAsync() {
  try {
    const { token, type } = await Expo.Facebook.logInWithReadPermissionsAsync(config.FACEBOOK_CLIENT_ID, {
      permissions: ['public_profile', 'email']
    })

    if (type === 'success') {
      fetch(`https://graph.facebook.com/me?access_token=${token}`).then((res) => res.json()).then((userInfo) => {
        fetch(`https://graph.facebook.com/v3.1/${userInfo.id}?fields=email&access_token=${token}`).then((res) => res.json()).then((emailInfo) => {
          console.log('first', userInfo)
          console.log('second', emailInfo)

          // potentially craft this below
          // const userObj = {
          //   id: userInfo.id,
          //   name: userInfo.name,
          //   email: emailInfo.email
          // }

          const credential = firebase.auth.FacebookAuthProvider.credential(token)
          firebase.auth().signInWithCredential(credential).then(() => {
            // if we got this far, then we need to somehow sign in with the user info we have...
          })
          .catch((error) => {
            console.log('ERROR - signing into firebase with facebook credentials:', error)
          })
        })
      })
    } else {
      console.log('signing into facebook failed', type)
    }
  } catch(e) {
    console.log('error signing into facebook', e)
  }
}

function addListeners(userID) {
  // WORKOUTS
  const workoutsRef = rootRef.child('workouts').orderByChild('userID').equalTo(userID)
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
  const sessionsRef = rootRef.child('sessions').orderByChild('userID').equalTo(userID)
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
  const notificationsRef = rootRef.child(`notifications`).orderByChild('userID').equalTo(userID)
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
  const usersRef = rootRef.child('users').orderByChild('userID').equalTo(userID)
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

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      action: LOGIN,
    }

    // if (config.DEV_MODE) {
    //   this.state.email = 'User5@gmail.com'
    //   this.state.password = 'password'
    //   this.onLogin()
    // }
  }

  onGoogleLogin = () => {
    signInWithGoogleAsync().then(res => {
      const user = res.user
      if (!user.uid) {
        // sets the uid on the user object
        user.uid = user.id
      }
      addListeners(user.uid)
      this.props.dispatchLogin(user)
    }).catch(error => {
      console.log("signin failed: " + error)
    })
  }

  onGoogleSignUp = () => {
    signInWithGoogleAsync().then(res => {
      const user = res.user
      if (!user.uid) {
        // sets the uid on the user object
        user.uid = user.id
      }
      addListeners(user.uid)
      this.props.dispatchLogin(user)
      this.props.addUser(user)
    }).catch(error => {
      console.log("signup failed: " + error)
    })
  }

  onGoogleSubmit = () => {
    switch (this.state.action) {
      case LOGIN:
        return this.onGoogleLogin()
      case SIGNUP:
        return this.onGoogleSignUp()
    }
  }

  onFBLogin = () => {
    signInWithFBAsync()
    // .then(user => {
    //   if (!user.uid) {
    //     // sets the uid on the user object
    //     user.uid = user.id
    //   }
    //   addListeners(user.uid)
    //   this.props.dispatchLogin(user)
    // }).catch(error => {
    //   console.log("signin failed: " + error)
    // })
  }

  onFBSignUp = () => {
    signInWithFBAsync().then((user) => {
      console.log('USER HERE', user)
      console.log('user id', user.id)

      if (!user.uid) {
        // sets the uid on the user object
        user.uid = user.id
      }
      addListeners(user.uid)
      this.props.dispatchLogin(user)
      this.props.addUser(user)
    }).catch(error => {
      console.log("signup failed: " + error)
    })
  }

  onFBSubmit = () => {
    switch (this.state.action) {
      case LOGIN:
        return this.onFBLogin()
      case SIGNUP:
        return this.onFBSignUp()
    }
  }

  onToggleAction = () => {
    this.setState({ action: this.state.action === LOGIN ? SIGNUP : LOGIN })
  }

  render() {
    const { width } = Dimensions.get('window')
    const buttonWidth = width - 36
    const buttonPadding = 10

    const googleText = this.state.action === LOGIN ? 'SIGN IN WITH GOOGLE' : 'SIGN UP WITH GOOGLE'
    const facebookText = this.state.action === LOGIN ? 'SIGN IN WITH FACEBOOK' : 'SIGN UP WITH FACEBOOK'

    return (
      <PressCapture onPress={this.handleCapture}>
        <View style={[common.staticView]}>
          <Text style={[common.headerFont, { marginTop: 70, marginBottom: 50, textAlign:'center', color: DYNAMIC.text5 }]}>
            MIGHTY
          </Text>
          <View style={[common.col, {marginTop: 70, marginBottom: 60}]}>
            <BasicButton onPress={() => this.onGoogleSubmit()}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'left', width: buttonWidth, backgroundColor: 'white', height: 56, shadowColor: DYNAMIC.text10, paddingRight: buttonPadding, paddingLeft: buttonPadding,
                shadowOpacity: 0.3,
                shadowOffset: { width: 1, height: 1 },
                shadowRadius: 2}}>
                <Image source={{uri: googleURI}} style={{width: 50, height: 50, verticalAlign: 'text-bottom', marginLeft: 6}} />
                <Text style={{ fontFamily: 'roboto-medium', fontSize: 18, color: DYNAMIC.text7, marginLeft: 14 }}>{googleText}</Text>
              </View>
            </BasicButton>
            <BasicButton onPress={() => this.onFBSubmit()}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'left', width: buttonWidth, backgroundColor: 'rgb(59, 89, 152)', height: 56, shadowColor: DYNAMIC.text10, paddingRight: buttonPadding, paddingLeft: buttonPadding,
                shadowOpacity: 0.3,
                shadowOffset: { width: 1, height: 1 },
                shadowRadius: 2}}>
                <Image source={{uri: facebookURI}} style={{width: 40, height: 40, verticalAlign: 'text-bottom', marginLeft: 10}} />
                <Text style={{ fontFamily: 'roboto-medium', fontSize: 18, color: DYNAMIC.text7, color: DYNAMIC.foreground, marginLeft: 20 }}>{facebookText}</Text>
              </View>
            </BasicButton>
          </View>
          <View style={[common.row]}>
            <Button
              style={{marginLeft: 10}}
              onPress={e => this.onToggleAction(e)}
              title={this.state.action === LOGIN ? `${SIGNUP}` : `${LOGIN}`}
            />
          </View>
        </View>
      </PressCapture>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchLogin: user => {
      dispatch(login(user))
    },
    addUser: (user) => {
      dispatch(UserActions.addUser(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
