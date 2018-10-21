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
  Button,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import Swipeout from 'react-native-swipeout'
import { Feather } from '@expo/vector-icons'
import { distanceInWords } from 'date-fns'

import { common, DYNAMIC } from './reusable/common'
import BasicButton from './reusable/basicButton'
import * as workoutActions from '../redux/actions/workoutActions'
import { openToast } from '../redux/actions/toastActions'

INITIAL_STATE = {
  selectedWorkout: null,
}

const mapStateToProps = (state, ownProps) => {
  return {
    sessions: state.sessions.sessions,
    workouts: state.workouts.workouts,
    userID: state.auth.user.uid,
  }
}

class PromptScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Record',
      tabBarLabel: 'Record',
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam('toAddWorkoutFlow')}>
          <Text style={{ padding: 10, paddingLeft: 30, fontSize: 18, color: DYNAMIC.link, fontFamily: 'rubik-medium'}}>
            Add Workout
          </Text>
        </TouchableOpacity>
      ),
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

  componentDidMount() {
    this.props.navigation.setParams({ toAddWorkoutFlow: this.toAddWorkoutFlow })
    // StatusBar.setHidden(true)
  }

  toAddWorkoutFlow = () => {
    this.props.navigation.navigate('ListExercises')
  }

  removeWorkout = (workoutID) => {
    const userID = this.props.userID
    this.props.removeWorkout(workoutID, userID)
    this.props.openToast('Workout Deleted')
  }

  recordSession = (name) => {
    const workout = this.props.workouts.find((workout) => workout.name === name)
    const exerciseData = {}
    const exerciseNames = []
    Object.entries(workout.exercises).forEach((exerciseEntry, eIdx) => {
      const exercise = exerciseEntry[1]
      exerciseData[eIdx] = {}
      exercise.attributes.forEach((attr, attrIdx) => {
        exerciseData[eIdx][attrIdx] = attr
      })
      exerciseNames.push(exercise.name)
    })

    this.props.navigation.navigate('AddSession', {
      workoutID: workout.id,
      workoutName: workout.name,
      exerciseData: exerciseData,
      exerciseNames: exerciseNames,
      workoutName: workout.name
    })
  }

  renderLastWorkoutDate = (workout) => {
    let mostRecentWorkout = 0
    this.props.sessions.forEach((session) => {
      if (session.workoutID === workout.id) {
        if (session.date > mostRecentWorkout) {
          mostRecentWorkout = session.date
        }
      }
    })
    if (mostRecentWorkout > 0) {
      mostRecentWorkout = distanceInWords(new Date(mostRecentWorkout), new Date())
      return <Text style={{fontSize: 18, color: DYNAMIC.black5}}>{`   ${mostRecentWorkout} ago`}</Text>
    } else {
      return null
    }
  }

  // needs a limit how how many can be rendered
  renderWorkoutButtons = () => {
    const workoutButtons = this.props.workouts.map((workout) => {
      const deleteButton = (
        <View style={[common.row, {paddingTop: 16}]}>
          <Feather name={"trash"} size={28} color={DYNAMIC.primary}/>
        </View>
      )

      const swipeoutBtns = [
        {
          component: deleteButton,
          backgroundColor: DYNAMIC.red8,
          onPress: this.removeWorkout.bind(this, workout.id)
        }
      ]

      return (
        <Swipeout right={swipeoutBtns} backgroundColor={'transparent'} key={workout.id}>
          <View style={{
            height: 60,
            borderTopColor: DYNAMIC.black1, borderTopWidth: 1,
            justifyContent: 'center'
          }}>
            <BasicButton onPress={this.recordSession.bind(this, workout.name)}>
              <Text style={[ common.tajawal5, common.mdFont, {color: DYNAMIC.primary, marginTop: 10}]}>
                { workout.name }
                { this.renderLastWorkoutDate(workout) }
              </Text>
            </BasicButton>
          </View>
        </Swipeout>
      )
    })
    return (
      <View style={[{ borderBottomColor: DYNAMIC.black1, borderBottomWidth: 1, }]}>
        <View style={[common.row, {margin: 10}]}>
          <Text style={[common.tajawal5, {fontSize: 22, color: DYNAMIC.black10, textAlign: 'center'}]}>
            {`Choose a workout:`}
          </Text>
        </View>
        { workoutButtons }
      </View>
    )
  }

  renderEmptyMessage = () => {
    const { height } = Dimensions.get('window')
    return (
      <View style={{ justifyContent: 'center', top: (height/2 - 120) }}>
        <View style={common.row}>
          <Text style={[{ fontFamily: 'rubik-medium', fontSize: 24, textAlign: 'center', color: DYNAMIC.black9 }]}>
            {'You have no workouts to record. Try adding one!'}
          </Text>
        </View>
      </View>
    )
  }

  render() {
    const { height } = Dimensions.get('window')
    const isEmpty = this.props.workouts.length === 0

    return (
      <View style={{ backgroundColor: DYNAMIC.white, height: height, justifyContent: 'flex-start' }}>
        <View style={[common.staticView, { paddingLeft: 10, paddingRight: 10 }]}>
          { isEmpty ? this.renderEmptyMessage() : this.renderWorkoutButtons() }
        </View>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeWorkout: (id, userID) => { dispatch(workoutActions.removeWorkout(id, userID)) },
    openToast: (message) => { dispatch(openToast({ toastString: message}))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromptScreen)
