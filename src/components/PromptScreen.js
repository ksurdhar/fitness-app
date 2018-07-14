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

class PromptScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Record',
      tabBarLabel: 'Record',
      headerRight: (
        <View style={{paddingRight: 10}}>
          <Button
            title="Add+"
            onPress={navigation.getParam('toAddWorkoutScreen')}
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
    console.log('PROMPT WORKOUT PROPS', this.props.workouts)
  }

  componentDidMount() {
     this.props.navigation.setParams({ toAddWorkoutScreen: this.toAddWorkoutScreen })
  }

  toAddWorkoutScreen = () => {
    this.props.navigation.navigate('AddWorkout')
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

  // needs a limit how how many can be rendered
  renderWorkoutButtons = () => {
    const workoutButtons = this.props.workouts.map((workout) => {
      const deleteButton = (
        <View style={[common.row, {paddingTop: 16}]}>
          <Feather name={"trash"} size={28} color={COLORS.white}/>
        </View>
      )

      const swipeoutBtns = [
        {
          component: deleteButton,
          backgroundColor: COLORS.orange,
          onPress: this.removeWorkout.bind(this, workout.id)
        }
      ]

      return (
        <Swipeout right={swipeoutBtns} backgroundColor={COLORS.white} key={workout.id}>
          <View style={{
            height: 60,
            borderTopColor: COLORS.gray1, borderTopWidth: 1,
            justifyContent: 'center'
          }}>
            <KButton
              textColor={COLORS.chill}
              value={workout.name}
              isEnabled={true}
              transparent={true}
              onPress={this.recordSession.bind(this, workout.name)}
            />
          </View>
        </Swipeout>
      )
    })
    return (
      <View style={[{ borderBottomColor: COLORS.gray1, borderBottomWidth: 1, }]}>
        { workoutButtons }
      </View>
    )
  }

  renderEmptyMessage = () => {
    const { height } = Dimensions.get('window')
    return (
      <View style={{ justifyContent: 'center', height: height/2 }}>
        <View style={common.row}>
          <Text style={[{ fontFamily: 'rubik-medium', fontSize: 24, textAlign: 'center', color: COLORS.gray9 }]}>
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
      <View style={common.staticView, {marginLeft: 10, marginRight: 10, backgroundColor: COLORS.white, height: height}}>
        { isEmpty ? this.renderEmptyMessage() : this.renderWorkoutButtons() }
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
