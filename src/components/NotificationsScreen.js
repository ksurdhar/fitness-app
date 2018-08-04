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
  Button
} from 'react-native'
import Swipeout from 'react-native-swipeout'
import { Feather } from '@expo/vector-icons'

import { common } from './reusable/common'
import KButton from './reusable/button'
import Switch from './reusable/switch'
import * as notificationActions from '../redux/actions/notificationActions'

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
  // save token to firebase
}

const mapStateToProps = (state, ownProps) => {
  return {
    workouts: state.workouts.workouts,
    userID: state.auth.user.uid,
    notifications: state.notifications.notifications
  }
}

class NotificationsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Notifications'
    }
  }

  constructor() {
    super()
    this.state = {
      notificationData: {} // object with workout id to notification
    }
  }


  componentDidMount() {
    registerForPushNotificationsAsync()
    console.log('props', this.props.notifications)
  }

  componentDidUpdate() {
    console.log('cmp update', this.props.notifications)
    // console.log('PROMPT WORKOUT PROPS', this.props.workouts)
  }

  addNotification = (workoutID) => {
    console.log('add notification')
    const dateObj = new Date()

    const hours = dateObj.getUTCHours()
    const minutes = dateObj.getMinutes()
    const daysInterval = 3
    const userID = this.props.userID

    this.props.addNotification(workoutID, userID, hours, minutes, daysInterval)
  }

  updateNotification = () => {
    console.log('updating notification')
  }

  removeNotification = (workoutID) => {
    this.props.removeNotification(workoutID)
  }

  toggleNotification = (workoutID) => {
    const notificationEnabled = this.props.notifications.some((notification) => {
      return notification.workoutID === workoutID
    })

    notificationEnabled ? this.removeNotification(workoutID) : this.addNotification(workoutID)
  }

  renderWorkouts = () => {
    const workoutElements = this.props.workouts.map((workout, idx) => {
      const notificationEnabled = this.props.notifications.some((notification) => {
        return notification.workoutID === workout.id
      })

      return (
        <View key={workout.id} style={[common.row, { marginTop: 20, justifyContent: 'left' }]}>
          <Text style={[common.tajawal5, {fontSize: 22, color: COLORS.gray10, textAlign: 'center'}]}>
            { workout.name }
          </Text>
          <Switch
            enabled={notificationEnabled}
            onPress={() => this.toggleNotification(workout.id, notificationEnabled) }
          />
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
    addNotification: (workoutID, userID, hours, minutes, daysInterval) => { dispatch(notificationActions.addNotification(workoutID, userID, hours, minutes, daysInterval)) },
    removeNotification: (workoutID) => { dispatch(notificationActions.removeNotification(workoutID)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen)
