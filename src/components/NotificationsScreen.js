import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
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
import * as workoutActions from '../redux/actions/workoutActions'

const mapStateToProps = (state, ownProps) => {
  return {
    workouts: state.workouts.workouts,
    userID: state.auth.user.uid,
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

  addNotification = (workoutID) => {
    console.log('add notification')
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.notificationData[workoutID] = new Date()
      })
    })
  }

  updateNotification = () => {
    console.log('updating notification')
  }

  removeNotification = (workoutID) => {
    console.log('remove notification')
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.notificationData[workoutID] = null
      })
    })
  }

  toggleNotification = (workoutID) => {
    console.log('toggling', workoutID)
    if (this.state.notificationData[workoutID]) {
      this.removeNotification(workoutID)
    } else {
      this.addNotification(workoutID)
    }
  }

  // here is where we grab the notifications endpoint and check if the toggles are on
  componentDidMount() {
    // console.log('mounted',this.props)
    // const notificationData = {}
    // this.props.workouts.for
    // this.setState()
  }

  componentDidUpdate() {
    console.log('cmp update', this.state)
    // console.log('PROMPT WORKOUT PROPS', this.props.workouts)
  }

  // if the switch is tapped, send a value to the server, change it with the time thing
  renderWorkouts = () => {
    const workoutElements = this.props.workouts.map((workout, idx) => {
      return (
        <View style={[common.row, { marginTop: 20, justifyContent: 'left' }]}>
          <Text style={[common.tajawal5, {fontSize: 22, color: COLORS.gray10, textAlign: 'center'}]}>
            { workout.name }
          </Text>
          <Switch
            enabled={this.state.notificationData[workout.id]}
            onPress={() => this.toggleNotification(workout.id) }
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
    removeWorkout: (id, userID) => { dispatch(workoutActions.removeWorkout(id, userID)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen)
