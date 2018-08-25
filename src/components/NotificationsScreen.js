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
import { Entypo } from '@expo/vector-icons'

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

  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false,
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

  renderDetails = (workout) => {
    return (
      <View style={{marginTop: -3}}>
        <TouchableOpacity onPress={() => { this.setState({ modalOpen: true, modalWorkoutID: workout.id })}}>
          <Text style={[common.tajawal3, {fontSize: 20, color: COLORS.gray6}]}>
            {`deliver x days after a workout \nat 0:00 AM`}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderModal = () => {
    const { height } = Dimensions.get('window')
    const workout = this.props.workouts.find((workout) => {
      return workout.id === this.state.modalWorkoutID
    })

    const offsetDate = new Date()
    const offset = offsetDate.getTimezoneOffset() / 60
    const hours = workout.notificationHours - offset
    const minutes = workout.notificationMinutes
    const pickerDate = new Date('1991', 0, 1, hours, minutes) // first three values are useless

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalOpen}
        onRequestClose={() => {
          alert('Modal has been closed.')
        }}>
        <TouchableWithoutFeedback onPress={() => { this.setState({modalOpen: false}) }}>
          <View style={{ backgroundColor: COLORS.gray7, height, justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={(event) => { event.stopPropagation() }}>
              <View style={{ backgroundColor: COLORS.white }}>
                <View style={[common.row, { marginTop: 20, marginLeft: 10, marginRight: 10 }]}>
                  <Text style={[common.tajawal5, {fontSize: 22, color: COLORS.gray10, textAlign: 'center'}]}>
                    { `Schedule notifications for\n${workout.name}` }
                  </Text>
                </View>

                <Picker
                  style={{ marginTop: 10, marginBottom: 10}}
                  onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
                  <Picker.Item label="1 day after working out" value="1" />
                  <Picker.Item label="2 days after working out" value="2" />
                  <Picker.Item label="3 days after working out" value="3" />
                  <Picker.Item label="4 days after working out" value="4" />
                  <Picker.Item label="5 days after working out" value="5" />
                  <Picker.Item label="6 days after working out" value="6" />
                  <Picker.Item label="7 days after working out" value="7" />
                </Picker>

                <View style={common.row}>
                  <Text style={[common.tajawal5, {fontSize: 20, color: COLORS.gray10, textAlign: 'center'}]}>
                    At
                  </Text>
                </View>

                <DatePickerIOS
                  date={pickerDate}
                  minuteInterval={ 15 }
                  mode={'time'}
                  onDateChange={ this.onDateChange.bind(this, workout.id) }
                />

                <TouchableOpacity onPress={() => { this.setState({modalOpen: false}) }}>
                  <Text>Hide Modal</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderWorkouts = () => {
    const workoutElements = this.props.workouts.map((workout, idx) => {
      const bellIcon =(
        <TouchableOpacity onPress={() => this.toggleNotification(workout)}>
          <View>
            <AnimatedIcon
            icon1={<Entypo name={'bell'} color={COLORS.gray3} size={30}/>}
            icon2={<Entypo name={'bell'} color={COLORS.celestialGreen} size={30}/>}
            isEnabled={!!workout.notificationsEnabled}
            size={30}
            style={{marginTop: 8}}
            />
          </View>
        </TouchableOpacity>
      )

      return (
        <View style={{marginLeft: 5, marginRight: 5, paddingBottom: 8, borderBottomColor: COLORS.gray1, borderBottomWidth: 1}} key={workout.id}>
          <View style={[common.row, { marginTop: 18,justifyContent: 'space-between' }]}>
            <Text style={[common.tajawal5, {fontSize: 22, color: COLORS.gray10, textAlign: 'center'}]}>
              { workout.name }
              <Text style={[common.tajawal5, {fontSize: 18, color: `${workout.notificationsEnabled ? COLORS.gray5: COLORS.gray5}` , textAlign: 'center',}]}>
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
      <View style={common.staticView, {paddingLeft: 10, paddingRight: 10, backgroundColor: COLORS.white, height: height}}>
        { this.state.modalOpen ? this.renderModal()  : null }
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
