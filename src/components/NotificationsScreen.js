import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import { Permissions, Notifications } from 'expo'
import {
  Dimensions,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Keyboard,
  View,
  Picker,
  Button,
  DatePickerIOS
} from 'react-native'
import Swipeout from 'react-native-swipeout'
import { Feather } from '@expo/vector-icons'

import { common } from './reusable/common'
import KButton from './reusable/button'
import Switch from './reusable/switch'
import * as notificationActions from '../redux/actions/notificationActions'
import * as workoutActions from '../redux/actions/workoutActions'
import * as userActions from '../redux/actions/userActions'

async function registerForPushNotificationsAsync() {
  console.log('registering for notifications!')
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    finalStatus = status
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  console.log('generated token:', token)
  return token
}

const mapStateToProps = (state, ownProps) => {
  return {
    workouts: state.workouts.workouts,
    userID: state.auth.user.uid,
    notifications: state.notifications.notifications,
    userData: state.users.user
  }
}

class NotificationsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Notifications'
    }
  }

  componentDidMount() {
    if (!this.props.userData.pushToken) {
      registerForPushNotificationsAsync().then((token) => {
        this.props.updateUser(this.props.userID, { pushToken: token })
      })
    } else {
      console.log('push notification already saved:', this.props.userData.pushToken)
    }
  }

  componentDidUpdate() {
    // console.log('cmp update', this.props.notifications)
    // console.log('PROMPT WORKOUT PROPS', this.props.workouts)
  }

  addNotification = (workoutID, workoutName) => {
    const dateObj = new Date()
    const hours = dateObj.getUTCHours()
    const unroundedMinutes = dateObj.getMinutes() // needs to be rounded
    const minutes = Math.floor(unroundedMinutes/15)*15

    const notificationObj = {
      workoutID,
      workoutName,
      pushToken: this.props.userData.pushToken,
      month: dateObj.getUTCMonth(),
      day: dateObj.getUTCDate(),
      hours,
      minutes, // needs to be rounded to 0, 15, 30, 45
      daysInterval: 3,
      userID: this.props.userID
    }

    this.props.addNotification(notificationObj)
    this.props.updateWorkout(workoutID, {
      notificationsEnabled: true,
      notificationHours: hours,
      notificationMinutes: minutes
    })
  }

  removeNotification = (workoutID) => {
    this.props.removeNotification(workoutID)
    this.props.updateWorkout(workoutID, {
      notificationsEnabled: false,
      notificationHours: null,
      notificationMinutes: null
    })
  }

  toggleNotification = (workout) => {
    const workoutID = workout.id
    const workoutName = workout.name
    workout.notificationsEnabled ? this.removeNotification(workoutID) : this.addNotification(workoutID, workoutName)
  }

  updateNotification = (workoutID, val) => {
    const dateObj = new Date(val)

    const hours = dateObj.getUTCHours() - 1 // maybe needs the minus 1 because of val
    const minutes = dateObj.getMinutes()
    const daysInterval = 3
    const userID = this.props.userID

    this.props.updateNotification(workoutID, {
      hours,
      minutes
    })
    this.props.updateWorkout(workoutID, {
      notificationHours: hours,
      notificationMinutes: minutes
    })
  }

  onDateChange = (workoutID, val) => {
    this.updateNotification(workoutID, val)
  }

  renderControls = (workout) => {
    const offsetDate = new Date()
    const offset = offsetDate.getTimezoneOffset() / 60

    const hours = workout.notificationHours - offset
    const minutes = workout.notificationMinutes
    const pickerDate = new Date('1991', 0, 1, hours, minutes) // first three values are useless

    // need to get the hour / minute from firebase notification, and update the value here
    return (
      <DatePickerIOS
        date={pickerDate}
        minuteInterval={ 15 }
        mode={'time'}
        onDateChange={ this.onDateChange.bind(this, workout.id) }
      />
    )
  }

  renderWorkouts = () => {
    const workoutElements = this.props.workouts.map((workout, idx) => {
      return (
        <View key={workout.id}>
          <View style={[common.row, { marginTop: 20, justifyContent: 'left' }]}>
            <Text style={[common.tajawal5, {fontSize: 22, color: COLORS.gray10, textAlign: 'center'}]}>
              { workout.name }
            </Text>
            <Switch
              enabled={ !!workout.notificationsEnabled }
              onPress={() => this.toggleNotification(workout) }
            />
          </View>
          { !!workout.notificationsEnabled ? this.renderControls(workout) : null }
        </View>
      )
    })
    return (
      <View style={[{ borderBottomColor: COLORS.gray1, borderBottomWidth: 1 }]}>
        { workoutElements }
      </View>
    )
  }

  render() {
    const { height } = Dimensions.get('window')
    const isEmpty = this.props.workouts.length === 0

    return (
      <View style={common.staticView, {paddingLeft: 10, paddingRight: 10, backgroundColor: COLORS.white, height: height}}>
        { this.renderWorkouts() }
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addNotification: (notificationObj) => { dispatch(notificationActions.addNotification(notificationObj)) },
    removeNotification: (workoutID) => { dispatch(notificationActions.removeNotification(workoutID)) },
    updateWorkout: (workoutID, patchObj) => { dispatch(workoutActions.updateWorkout(workoutID, patchObj))},
    updateNotification: (workoutID, patchObj) => { dispatch(notificationActions.updateNotification(workoutID, patchObj))},
    updateUser: (userID, patchObj) => { dispatch(userActions.updateUser(userID, patchObj)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen)
