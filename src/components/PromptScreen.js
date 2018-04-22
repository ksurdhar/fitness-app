import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import {
  StyleSheet,
  Text,
  ScrollView,
  Button,
  TextInput,
  Keyboard,
  View,
} from 'react-native'
import * as workoutActions from '../redux/actions/workoutActions'
import { Dropdown } from 'react-native-material-dropdown'

INITIAL_STATE = {
  workoutName: '',
  inputValues: [],
  exerciseData: {},
  newWorkout: null,
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
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  componentDidUpdate() {
    // console.log('RECORD STATE',this.state)
    // console.log('RECORD PROPS', this.props)
  }

  recordSession(workoutName, idx) {
    if (idx === this.props.workouts.length) {
      this.props.navigation.navigate('NameWorkout')
    } else {
      const workoutKey = Object.keys(this.props.workouts)[idx]
      const workout = this.props.workouts[workoutKey]

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
  }

  renderWorkoutDropdown() {
    const workoutNames = Object.entries(this.props.workouts).map((workoutEntry, workoutIdx) => {
      return { value: workoutEntry[1].name }
    })
    workoutNames.push({ value: 'Add New Workout'})

    if (workoutNames.length > 0) {
      const dropDown = (
        <View style={{ flexDirection: 'row', paddingTop: 80 }}>
          <View style={{ flex: 1, marginLeft: 15, marginRight: 15 }}>
            <Dropdown
              animationDuration={50}
              rippleOpacity={.3}
              dropdownOffset={{top:110, left:0}}
              label='Workout Type'
              data={workoutNames}
              onChangeText={ this.recordSession.bind(this) }
            />
          </View>
        </View>
      )
      return dropDown
    }

    return null
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.container}>
          <Text>Choose a workout</Text>
          { this.renderWorkoutDropdown() }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 40,
    marginTop: 60,
    marginBottom: 60,
  },
})

export default connect(mapStateToProps)(PromptScreen)
