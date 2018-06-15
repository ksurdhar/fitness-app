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
    title: 'Record',
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  }

  constructor() {
    super()
    this.state = INITIAL_STATE
    this.renderPicker = this.renderPicker.bind(this)
    this.recordSession = this.recordSession.bind(this)
    this.toAddWorkoutScreen = this.toAddWorkoutScreen.bind(this)
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  componentDidUpdate() {
    // console.log('RECORD STATE',this.state)
  }

  toAddWorkoutScreen() {
    this.props.navigation.navigate('NameWorkout')
  }

  recordSession() {
    const workout = this.props.workouts.find((workout) => workout.name === this.state.selectedWorkout)
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

  renderPicker() {
    const workoutItems = Object.entries(this.props.workouts).map((workoutEntry, workoutIdx) => {
      const name = workoutEntry[1].name
      return <Picker.Item label={name} value={name} key={name}/>
    })
    return (
      <View style={[common.row]}>
        <Picker style={{ height: 50, width: 300, paddingBottom: 200 }}
          selectedValue={this.state.selectedWorkout}
          onValueChange={(val, idx) => this.setState({selectedWorkout: val})}
          itemStyle={[common.baseFont, {fontSize: 30}]}>
          {workoutItems}
        </Picker>
      </View>
    )
  }

  render() {
    return (
      <View style={common.staticView}>
        <View style={[common.row, { marginTop: 20 }]}>
          <Text style={[common.baseFont, {color: COLORS.gray5}]}>
            Choose a workout
          </Text>
        </View>
        { this.renderPicker() }
        <View style={[common.row, { marginTop: 40 }]}>
          <KButton
            style={{width: 200}}
            onPress={this.recordSession}
            value={'record'}
            isEnabled={true}
          />
        </View>
        <View style={[common.row, { marginTop: 100 }]}>
          <Button
            onPress={this.toAddWorkoutScreen}
            title="Or Create New Workout"/>
        </View>
      </View>
    )
  }
}

export default connect(mapStateToProps)(PromptScreen)
