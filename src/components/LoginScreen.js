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
import * as UserActions from '../redux/actions/userActions'

import config from '../../config.js'
import store from '../redux/store.js'

const logoURI =  Expo.Asset.fromModule(require('../../assets/images/logo.png')).uri
const googleURI = Expo.Asset.fromModule(require('../../assets/images/test.png')).uri
const facebookURI = Expo.Asset.fromModule(require('../../assets/images/fbwhite.png')).uri

const LOGIN = "I already have an account"
const SIGNUP = "Register"

async function signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      iosClientId: config.IOS_CLIENT_ID,
      scopes: ['profile', 'email'],
    })
    if (result.type === 'success') {
      const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)
      firebase.auth().signInWithCredential(credential)
      .catch((error) => {
        console.log('ERROR - signing into firebase with google credentials:', error)
      })
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

          const credential = firebase.auth.FacebookAuthProvider.credential(token)
          firebase.auth().signInWithCredential(credential)
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

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      action: LOGIN,
    }

    firebase.auth().onAuthStateChanged((user) => {
      console.log('AUTH CHANGED', user)
      if (user != null && !this.props.isLoggedIn) {
        console.log("We are authenticated now!", user)
        const userObj = {
          email: user.email,
          name: user.displayName,
          uid: user.uid,
          userID: user.uid,
        }

        props.dispatchLogin(userObj)
        // only conditionally do this
        props.addUser(userObj)
      }
    })
  }

  onGoogleLogin = () => {
    signInWithGoogleAsync()
  }

  onGoogleSignUp = () => {
    // check to see if user exists already
    signInWithGoogleAsync()
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
  }

  onFBSignUp = () => {
    // needs to check if user exists alreadys
    signInWithFBAsync()
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

  // <View style={{justifyContent: 'flex-start'}}>
  //   <Text style={{ fontFamily: 'mplus', fontSize: 60, marginTop: 70, textAlign:'center', color: DYNAMIC.white }}>
  //     倔
  //   </Text>
  //   <Text style={{ fontFamily: 'rubik', fontSize: 40, marginTop: -20, marginBottom: 20, textAlign:'center', color: DYNAMIC.white }}>
  //     {`STUBBORN`}
  //   </Text>
  // </View>

  render() {
    const { width } = Dimensions.get('window')
    const buttonStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'left',
      width: (width - 36) / 2,
      height: 56,
      shadowColor: DYNAMIC.black10,
      paddingRight: 10,
      paddingLeft: 10,
      shadowOpacity: 0.3,
      shadowOffset: { width: 1, height: 1 },
      shadowRadius: 2
    }

    return (
      <PressCapture onPress={this.handleCapture}>
        <View style={[common.staticView, {justifyContent: 'space-between', backgroundColor: DYNAMIC.primary}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 50}}>
            <Image source={{uri: logoURI}} style={{ width: 300, height: 200}}/>
          </View>

          <View style={[common.row, { marginBottom: 100}]}>
            <BasicButton onPress={() => this.onGoogleSubmit()}>
              <View style={[buttonStyle, {backgroundColor: DYNAMIC.white}]}>
                <Image source={{uri: googleURI}} style={{width: 50, height: 50, verticalAlign: 'text-bottom'}} />
                <Text style={{ fontFamily: 'roboto-medium', fontSize: 16, color: DYNAMIC.black8, marginLeft: 8 }}>
                  Google
                </Text>
              </View>
            </BasicButton>
            <BasicButton onPress={() => this.onFBSubmit()}>
              <View style={[buttonStyle, {backgroundColor: 'rgb(59, 89, 152)'}]}>
                <Image source={{uri: facebookURI}} style={{width: 40, height: 40, verticalAlign: 'text-bottom', marginLeft: 10}} />
                <Text style={{ fontFamily: 'roboto-medium', fontSize: 16, color: DYNAMIC.white, marginLeft: 20 }}>
                  Facebook
                </Text>
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
    isLoggedIn: state.auth.isLoggedIn,
    user: state.users.user
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
