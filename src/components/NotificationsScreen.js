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
import * as workoutActions from '../redux/actions/workoutActions'

INITIAL_STATE = {
  selectedWorkout: null,
}

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
    this.state = INITIAL_STATE
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  componentDidUpdate() {
    // console.log('PROMPT WORKOUT PROPS', this.props.workouts)
  }

  // render each workout name
  renderWorkouts = () => {
    const workoutElements = this.props.workouts.map((workout) => {
      return (
        <View style={[common.row, { marginTop: 20 }]}>
          <Text style={[common.tajawal5, {fontSize: 22, color: COLORS.gray10, textAlign: 'center'}]}>
            { workout.name }
          </Text>
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
