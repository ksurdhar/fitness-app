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
  DatePickerIOS,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Switch
} from 'react-native'
import Swipeout from 'react-native-swipeout'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'

import { common } from './reusable/common'
import AnimatedIcon from './reusable/animatedIcon'
import KButton from './reusable/button'
import KSwitch from './reusable/switch'
import KInput from './reusable/input'
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

const NOTIFICATION_MODALS = {
  help: 'Help',
  scheduling: 'Scheduling'
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
      title: 'Notifications',
      headerRight: (
        <View style={{paddingRight: 10}}>
          <TouchableOpacity onPress={navigation.getParam('openHelpModal')}>
            <Ionicons name='ios-help-circle-outline' color={DYNAMIC.text8} size={30}/>
          </TouchableOpacity>
        </View>
      )
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      modalType: null,
      modalWorkoutID: null
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
    this.props.navigation.setParams({
      openHelpModal: () => { this.setState({ modalType: NOTIFICATION_MODALS.help }) }
    })
  }

  componentDidUpdate() {
    // console.log('cmp update', this.props.notifications)
    // console.log('PROMPT WORKOUT PROPS', this.props.workouts)
  }

  addNotification = (workoutID, workoutName) => {
    const dateObj = new Date()
    const hours = dateObj.getUTCHours()
    const unroundedMinutes = dateObj.getMinutes()
    const minutes = Math.floor(unroundedMinutes/15)*15

    const notificationObj = {
      workoutID,
      workoutName,
      pushToken: this.props.userData.pushToken,
      hours,
      minutes, // needs to be rounded to 0, 15, 30, 45
      daysInterval: 3,
      userID: this.props.userID
    }

    this.props.addNotification(notificationObj)
    this.props.updateWorkout(workoutID, {
      notificationsEnabled: true,
      notificationHours: hours,
      notificationMinutes: minutes,
      notificationInterval: 3
    })
  }

  removeNotification = (workoutID) => {
    this.props.removeNotification(workoutID)
    this.props.updateWorkout(workoutID, {
      notificationsEnabled: false,
      notificationHours: null,
      notificationMinutes: null,
      notificationInterval: null
    })
  }

  toggleNotification = (workout) => {
    const workoutID = workout.id
    const workoutName = workout.name
    workout.notificationsEnabled ? this.removeNotification(workoutID) : this.addNotification(workoutID, workoutName)
  }

  updateNotificationTime = (workoutID, val) => {
    const dateObj = new Date(val)

    const hours = dateObj.getUTCHours() - 1 // maybe needs the minus 1 because of val
    const minutes = dateObj.getMinutes()
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

  updateNotificationInterval = (workoutID, val) => {
    const interval = parseInt(val, 10)
    this.props.updateNotification(workoutID, {
      daysInterval: interval,
    })
    this.props.updateWorkout(workoutID, {
      notificationInterval: interval,
    })
  }

  onDateChange = (workoutID, val) => {
    this.updateNotificationTime(workoutID, val)
  }

  onIntervalChange = (workoutID, val) => {
    this.updateNotificationInterval(workoutID, val)
  }

  renderDetails = (workout) => {
    const { width } = Dimensions.get('window')
    const offsetDate = new Date()
    const offset = offsetDate.getTimezoneOffset() / 60
    const hours = workout.notificationHours - offset
    const formattedTime = format(new Date('1991', 0, 1, hours, workout.notificationMinutes), 'h:mm A')
    const interval = workout.notificationInterval

    return (
      <View style={{ marginTop: -3, width: width/1.5 }}>
        <TouchableOpacity onPress={() => { this.setState({ modalType: NOTIFICATION_MODALS.scheduling, modalWorkoutID: workout.id })}}>
          <Text style={[common.tajawal3, {fontSize: 20, color: DYNAMIC.text6}]}>
            {`deliver `}
            <Text style={{ textDecorationLine: 'underline' }}>{`${interval} days`}</Text>
            {` after a workout \nat `}
            <Text style={{ textDecorationLine: 'underline' }}>{ formattedTime }</Text>
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderModal = () => {
    const { height, width } = Dimensions.get('window')

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalType}>
        <TouchableWithoutFeedback onPress={() => { this.setState({ modalType: null }) }}>
          <View style={{ backgroundColor: DYNAMIC.text7, height, justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={(event) => { event.stopPropagation() }}>
              <View style={{ backgroundColor: DYNAMIC.foreground }}>
                { this[`render${this.state.modalType}Modal`]() }
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderHelpModal = () => {
    return (
      <View style={[common.row, { marginTop: 20, marginLeft: 20, marginRight: 20 }]}>
        <Text style={[common.tajawal3, {fontSize: 20, color: DYNAMIC.text10, textAlign: 'left'}]}>
          Set reminders for specific workouts by enabling notifications. {'\n'}{'\n'}
          Once a notification is enabled, you can tailor their delivery time. {'\n'}{'\n'}
          You will receive a notification after recording a session of a given workout. {'\n'}{'\n'}
          For example, if you set a interval of: {'\n'}{'\n'}
          <Text style={common.tajawal5}>3 days at 9:30 AM for a leg workout {'\n'}{'\n'}</Text>
          and record a leg workout session at: {'\n'}{'\n'}
          <Text style={common.tajawal5}>6:45 PM on a Tuesday{'\n'}{'\n'}</Text>
          You will receive a reminder on Friday (3 days later) at 9:30 AM. {'\n'}{'\n'}
        </Text>
      </View>
    )
  }

  renderSchedulingModal = () => {
    const { height, width } = Dimensions.get('window')
    const workout = this.props.workouts.find((workout) => {
      return workout.id === this.state.modalWorkoutID
    })

    const offsetDate = new Date()
    const offset = offsetDate.getTimezoneOffset() / 60
    const hours = workout.notificationHours - offset
    const minutes = workout.notificationMinutes
    const pickerDate = new Date('1991', 0, 1, hours, minutes) // first three values are useless

    return (
      <View>
        <View style={[common.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
          <Text style={[common.tajawal5, {fontSize: 22, color: DYNAMIC.text10, textAlign: 'center'}]}>
            { `Send notifications for\n${workout.name}` }
          </Text>
        </View>

        <Picker
          selectedValue={ workout.notificationInterval.toString() }
          style={{ height: 120, marginBottom: 20, width}}
          itemStyle={{ height: 120 }}
          onValueChange={ this.onIntervalChange.bind(this, workout.id) }
          >
          <Picker.Item label="1 day after working out" value="1" />
          <Picker.Item label="2 days after working out" value="2" />
          <Picker.Item label="3 days after working out" value="3" />
          <Picker.Item label="4 days after working out" value="4" />
          <Picker.Item label="5 days after working out" value="5" />
          <Picker.Item label="6 days after working out" value="6" />
          <Picker.Item label="7 days after working out" value="7" />
        </Picker>

        <View style={common.row}>
          <Text style={[common.tajawal5, {fontSize: 20, color: DYNAMIC.text10, textAlign: 'center'}]}>
            At
          </Text>
        </View>

        <DatePickerIOS
          date={pickerDate}
          minuteInterval={ 15 }
          mode={'time'}
          onDateChange={ this.onDateChange.bind(this, workout.id) }
        />
      </View>
    )
  }

  renderWorkouts = () => {
    const workoutElements = this.props.workouts.map((workout, idx) => {
      const bellIcon =(
        <TouchableOpacity onPress={() => this.toggleNotification(workout)}>
          <View>
            <AnimatedIcon
              icon1={<Entypo name={'bell'} color={DYNAMIC.text3} size={30}/>}
              icon2={<Entypo name={'bell'} color={DYNAMIC.green} size={30}/>}
              isEnabled={!!workout.notificationsEnabled}
              size={30}
              style={{marginTop: 8}}
            />
          </View>
        </TouchableOpacity>
      )

      return (
        <View style={{marginLeft: 5, marginRight: 5, paddingBottom: 8, borderBottomColor: DYNAMIC.text1, borderBottomWidth: 1}} key={workout.id}>
          <View style={[common.row, { marginTop: 18,justifyContent: 'space-between' }]}>
            <Text style={[common.tajawal5, {fontSize: 22, color: DYNAMIC.text10, textAlign: 'center'}]}>
              { workout.name }
              <Text style={[common.tajawal5, {fontSize: 18, color: `${workout.notificationsEnabled ? DYNAMIC.text5: DYNAMIC.text5}` , textAlign: 'center',}]}>
                { `    ${workout.notificationsEnabled ? 'Enabled' : 'Disabled'}` }
              </Text>
            </Text>
            <View style={{ marginTop: -16, marginRight: 5 }}>
              { bellIcon }
            </View>
          </View>
          { workout.notificationsEnabled ? this.renderDetails(workout) : null}
        </View>
      )
    })
    return (
      <View>
        { workoutElements }
      </View>
    )
  }

  render() {
    const { height } = Dimensions.get('window')
    const isEmpty = this.props.workouts.length === 0

    return (
      <View style={common.staticView, {paddingLeft: 10, paddingRight: 10, backgroundColor: DYNAMIC.foreground, height: height}}>
        { this.state.modalType ? this.renderModal() : null }
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
