import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import {
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Keyboard,
  View,
  Picker,
  Button
} from 'react-native'
import { common } from './reusable/styles'
import KButton from './reusable/button'
import * as workoutActions from '../redux/actions/workoutActions'

INITIAL_STATE = {
  selectedWorkout: null,
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    workouts: state.workouts.workouts,
  }
}

class PromptScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  }

  constructor() {
    super()
    this.state = INITIAL_STATE
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  componentDidUpdate() {
    // console.log('PROMPT STATE',this.state)
    console.log('PROMPT WORKOUT PROPS', this.props.workouts)
  }

  toAddWorkoutScreen = () => {
    this.props.navigation.navigate('AddWorkout')
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

  // needs a limit how how many can be rendered
  renderWorkoutButtons = () => {
    // add logic of where to go w workout ID
    const workoutButtons = this.props.workouts.map((workout) => {
      const name = workout.name
      return (
        <View style={{
          height: 60,
          borderTopColor: COLORS.gray1, borderTopWidth: 1,
        }}>
          <KButton
            style={{marginTop: 14}}
            textColor={COLORS.chill}
            value={name}
            isEnabled={true}
            transparent={true}
            onPress={this.recordSession.bind(this, name)}
          />
        </View>
      )
    })
    return (
      <View style={[{ marginTop: 60, borderBottomColor: COLORS.gray1, borderBottomWidth: 1, }]}>
        { workoutButtons }
      </View>
    )
  }

  renderEmptyMessage = () => {
    return (
      <View style={[common.row, { marginTop: 160 }]}>
        <Text style={[{ fontFamily: 'rubik-medium', fontSize: 24, textAlign: 'center', color: COLORS.gray9 }]}>
          {'You have no workouts to record. Try adding one!'}
        </Text>
      </View>
    )
  }
  // add icon below content
  render() {
    const isEmpty = this.props.workouts.length === 0
    return (
      <View style={common.staticView, {marginLeft: 10, marginRight: 10}}>
        <View style={[common.row,  { marginTop: 20, justifyContent: 'space-between' }]}>
          <Text style={[common.baseFont, common.lgFont, {marginLeft: 10, color: COLORS.gray10}]}>
            Record
          </Text>
          <KButton
            style={{width: 120, top: 9}}
            textColor={COLORS.chill}
            onPress={this.toAddWorkoutScreen}
            value={'Add +'}
            isEnabled={true}
            transparent={true}
          />
        </View>
        { isEmpty ? this.renderEmptyMessage() : this.renderWorkoutButtons() }
      </View>
    )
  }
}

export default connect(mapStateToProps)(PromptScreen)
