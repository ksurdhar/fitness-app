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
  Picker
} from 'react-native'
import { commonStyles } from './reusable/styles'
import Button from './reusable/button'
import * as workoutActions from '../redux/actions/workoutActions'

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
    this.renderPicker = this.renderPicker.bind(this)
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

  // renderWorkoutDropdown() {
  //   const workoutNames = Object.entries(this.props.workouts).map((workoutEntry, workoutIdx) => {
  //     return { value: workoutEntry[1].name }
  //   })
  //   workoutNames.push({ value: 'Add New Workout'})
  //
  //   if (workoutNames.length > 0) {
  //     const dropDown = (
  //       <View style={{ flexDirection: 'row', paddingTop: 80 }}>
  //         <View style={{ flex: 1, marginLeft: 15, marginRight: 15 }}>
  //           <Dropdown
  //             animationDuration={50}
  //             rippleOpacity={.3}
  //             dropdownOffset={{top:110, left:0}}
  //             label='Workout Type'
  //             data={workoutNames}
  //             onChangeText={ this.recordSession.bind(this) }
  //           />
  //         </View>
  //       </View>
  //     )
  //     return dropDown
  //   }
  //
  //   return null
  // }

  renderPicker() {
    const workoutItems = Object.entries(this.props.workouts).map((workoutEntry, workoutIdx) => {
      const name = workoutEntry[1].name
      return <Picker.Item label={name} value={name} />
    })
    return (
      <View style={[commonStyles.row]}>
        <Picker style={{ height: 50, width: 300, paddingBottom: 200 }}
          itemStyle={[commonStyles.baseFont, {fontSize: 30}]}>
          {workoutItems}
        </Picker>
      </View>
    )
  }

  render() {
    return (
      <View style={commonStyles.staticView}>
        <View style={[commonStyles.row, { marginTop: 40 }]}>
          <Text style={[commonStyles.baseFont, {color: COLORS.gray5}]}>
            Choose a workout
          </Text>
        </View>
        { this.renderPicker() }
        <View style={[commonStyles.row, { marginTop: 40 }]}>
          <Button
            style={{width: 200}}
            onPress={(val) => console.log('pressed: ' + val)}
            value={'record'}
          />
        </View>
        <View style={[commonStyles.row, { marginTop: 40 }]}>
          <Text style={[commonStyles.baseFont, {color: COLORS.gray5}]}>
            Or create a workout
          </Text>
        </View>
      </View>
    )
  }
}

export default connect(mapStateToProps)(PromptScreen)
