import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import {
  ScrollView,
  Dimensions,
  Animated,
  Button,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native'

import KButton from './reusable/button'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import Fade from './reusable/fade'
import { common, COLORS } from './reusable/styles'

DEMO_STATE = {
  mockWorkouts: ['Leg Blasters', 'Ab Crunches', 'Arm Destroyer'],
  selectedWorkout: null
}

class DemoScreen extends React.Component {
  static navigationOptions = {
    title: 'DEMO SCREEN',
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => (
      <Text>Record</Text>
    )
  }

  constructor() {
    super()
    this.state = DEMO_STATE
  }

  resetState() {
    this.setState(DEMO_STATE)
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  componentDidUpdate() {
    console.log('state', this.state)
  }

  // needs a limit how how many can be rendered
  renderWorkoutButtons = () => {
    // add logic of where to go w workout ID
    const workoutButtons = DEMO_STATE.mockWorkouts.map((name) => {
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
            onPress={() => {console.log('you pressed ' + name)}}
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
    const isEmpty = false // replace with state condition
    return (
      <View style={common.staticView, {marginTop: 70, marginLeft: 10, marginRight: 10}}>
        <View style={[common.row,  { marginTop: 20, justifyContent: 'space-between' }]}>
            <Text style={[common.baseFont, common.lgFont, {marginLeft: 10, color: COLORS.gray10}]}>
              Record
            </Text>
          <KButton
            style={{width: 120, top: 9}}
            textColor={COLORS.chill}
            onPress={this.recordSession}
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

export default connect(null, null)(DemoScreen)
