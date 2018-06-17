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
  mockWorkouts: ['Leg Blasters', 'Ab Crunches', 'Arm Destroyer', 'Leg Blasters', 'Ab Crunches', 'Arm Destroyer'],
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

  renderWorkoutCards = () => {
    const { width } = Dimensions.get('window')

    const cards = this.state.mockWorkouts.map((workoutName) => {
      return (
        <View style={{width: width, height: 160, backgroundColor: COLORS.gray2, marginBottom: 20}}>
          <Text>{workoutName}</Text>
          <Text>{'blah blah blah'}</Text>
          <Text>{'blah blah blah'}</Text>
          <Text>{'blah blah blah'}</Text>
        </View>
      )
    })

    return cards
  }

  render() {

    return (
      <View style={common.staticView, {marginTop: 70, marginLeft: 10, marginRight: 10}}>
        <View style={[common.row,  { marginTop: 20, justifyContent: 'space-between' }]}>
          <Text style={[common.baseFont, common.lgFont, {marginLeft: 10, color: COLORS.gray10}]}>
            Workouts
          </Text>
        </View>
        <ScrollView>
          { this.renderWorkoutCards() }
        </ScrollView>
      </View>
    )
  }
}

export default connect(null, null)(DemoScreen)
