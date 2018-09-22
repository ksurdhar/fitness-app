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
import { distanceInWords } from 'date-fns'

import { common, DYNAMIC } from './reusable/common'
import BasicButton from './reusable/basicButton'
import * as workoutActions from '../redux/actions/workoutActions'

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
        <View style={{paddingRight: 10}}>
          <Button
            title="Add"
            onPress={navigation.getParam('toAddWorkoutFlow')}
          />
        </View>
      )
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
  }

  toAddWorkoutFlow = () => {
    this.props.navigation.navigate('ListExercises')
  }

  removeWorkout = (workoutID) => {
    const userID = this.props.userID
    this.props.removeWorkout(workoutID, userID)
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
      return <Text>{` - ${mostRecentWorkout} ago`}</Text>
    } else {
      return null
    }
  }

  // needs a limit how how many can be rendered
  renderWorkoutButtons = () => {
    const workoutButtons = this.props.workouts.map((workout) => {
      const deleteButton = (
        <View style={[common.row, {paddingTop: 16}]}>
          <Feather name={"trash"} size={28} color={DYNAMIC.foreground}/>
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
        <Swipeout right={swipeoutBtns} backgroundColor={DYNAMIC.foreground} key={workout.id}>
          <View style={{
            height: 60,
            borderTopColor: DYNAMIC.text1, borderTopWidth: 1,
            justifyContent: 'center'
          }}>
            <BasicButton onPress={this.recordSession.bind(this, workout.name)}>
              <Text style={[ common.tajawal5, common.mdFont, {color: DYNAMIC.link}]}>
                { workout.name }
                { this.renderLastWorkoutDate(workout) }
              </Text>
            </BasicButton>
          </View>
        </Swipeout>
      )
    })
    return (
      <View style={[{ borderBottomColor: DYNAMIC.text1, borderBottomWidth: 1, }]}>
        <View style={[common.row, {marginTop: 20}]}>
          <Text style={[common.tajawal5, {fontSize: 22, color: DYNAMIC.text10, textAlign: 'center'}]}>
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
          <Text style={[{ fontFamily: 'rubik-medium', fontSize: 24, textAlign: 'center', color: DYNAMIC.text9 }]}>
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
      <View style={common.staticView, {paddingLeft: 10, paddingRight: 10, backgroundColor: DYNAMIC.foreground, height: height}}>
        {
          isEmpty
          ? this.renderEmptyMessage()
          : this.renderWorkoutButtons()
      }
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeWorkout: (id, userID) => { dispatch(workoutActions.removeWorkout(id, userID)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromptScreen)
