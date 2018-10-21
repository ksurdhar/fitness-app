import React from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native'
import { Entypo, Feather } from '@expo/vector-icons'

import { format } from 'date-fns'
import * as authActions from '../redux/actions/authActions.js'
import { firebaseApp } from '../firebase.js'
import { common, DYNAMIC } from './reusable/common'
import BasicButton from './reusable/basicButton'

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile'
  }

  constructor(props) {
    super(props)

    this.state = {
      numberSessionsThisWeek: 0,
      mostRecentSession: null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.sessions.length !== this.props.sessions.length) {
      if (this.props.sessions && this.props.sessions.length > 0) {
        const lastMonday = new Date()
        lastMonday.setDate(lastMonday.getDate() - (lastMonday.getDay() + 6) % 7)
        lastMonday.setHours(0)

        let count = 0
        let mostRecentSession = this.props.sessions[0]
        this.props.sessions.forEach((session) => {
          if (session.date > lastMonday.getTime()) {
            count = count + 1
          }
          if (session.date > mostRecentSession.date) {
            mostRecentSession = session
          }
        })

        this.setState({
          numberSessionsThisWeek: count,
          mostRecentSession
        })
      }
    }
  }

  logout = () => {
    firebaseApp.database().ref().child('workouts').orderByChild('userID').equalTo(this.props.user.userID).off()
    firebaseApp.database().ref().child('notifications').orderByChild('userID').equalTo(this.props.user.userID).off()
    firebaseApp.database().ref().child('sessions').orderByChild('userID').equalTo(this.props.user.userID).off()
    firebaseApp.database().ref().child('users').orderByChild('userID').equalTo(this.props.user.userID).off()

    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.logout()
        console.log('logged out!')
      })
  }

  toNotifications = () => {
    this.props.navigation.navigate('Notifications')
  }

  render() {
    const { height } = Dimensions.get('window')
    const latestSession = this.state.mostRecentSession
    const lastWorkoutText = latestSession
      ? `Last workout: ${latestSession.workoutName} on ${format(latestSession.date, 'MMM D')}`
      : 'Last workout: None'

    return (
      <View style={common.staticView, {paddingLeft: 10, paddingRight: 10, backgroundColor: DYNAMIC.white, height: height}}>
        <View style={[common.row, {marginTop: 20, justifyContent: 'flex-start'}]}>
          <Text style={[common.tajawal5, {fontSize: 26, color: DYNAMIC.black9}]}>
            {this.props.user.email}
          </Text>
        </View>
        <View style={[common.row, {marginTop: 16, justifyContent: 'flex-start'}]}>
          <Text style={[common.tajawal5, {fontSize: 20, color: DYNAMIC.black9}]}>
            {`Weekly workouts recorded: ${this.state.numberSessionsThisWeek}`}
          </Text>
        </View>
        <View style={[common.row, {marginTop: 16, justifyContent: 'flex-start'}]}>
          <Text style={[common.tajawal5, {fontSize: 20, color: DYNAMIC.black9}]}>
            { lastWorkoutText }
          </Text>
        </View>
        <BasicButton style={{marginLeft: -10, marginBottom: -10, justifyContent: 'flex-start'}} onPress={() => this.toNotifications()}>
          <Text style={[ common.tajawal5, {fontSize: 20, color: DYNAMIC.primary, marginTop: 10}]}>
            Notification Preferences
          </Text>
        </BasicButton>
        <BasicButton style={{marginLeft: -10, maginTop: -10, justifyContent: 'flex-start'}} onPress={() => this.logout()}>
          <Text style={[ common.tajawal5, {fontSize: 20, color: DYNAMIC.primary, marginTop: 10}]}>
            Logout
          </Text>
        </BasicButton>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    sessions: state.sessions.sessions,
    isLoggedIn: state.auth.isLoggedIn,
    userInfo: state.users.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (name) => { dispatch(authActions.logout()) },
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
