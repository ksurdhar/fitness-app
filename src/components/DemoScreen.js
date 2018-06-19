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
import { format } from 'date-fns'

import KButton from './reusable/button'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import Fade from './reusable/fade'
import { common, COLORS } from './reusable/styles'

DEMO_STATE = {
  mockWorkouts: ['Leg Blasters', 'Ab Crunches', 'Arm Destroyer', 'Leg Blasters', 'Ab Crunches', 'Arm Destroyer']
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

  // drop shadow requires there to be a background color
  renderWorkoutCards = () => {
    const { width } = Dimensions.get('window')

    const cards = this.state.mockWorkouts.map((workoutName) => {
      const date = new Date()
      return (
        <View style={{
          width: width - 30,
          minHeight: 180,
          backgroundColor: COLORS.white,
          marginBottom: 16,
          marginLeft: 6,
          shadowColor: COLORS.gray10,
          shadowOpacity: 0.3,
          shadowOffset: { width: 1, height: 1 },
          shadowRadius: 2,
          paddingTop: 8,
          paddingBottom: 8,
        }}>
          <View style={{borderBottomColor: COLORS.gray1, borderBottomWidth: 1, marginBottom: 10, top: 64, zIndex: 2}} />
          <View style={{
            paddingLeft: 16,
            paddingRight: 16,
          }}>
            <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{format(date, 'dddd, MMM D [at] h:mm A')}</Text>
            <Text style={[common.tajawal5, {fontSize: 26, color: COLORS.gray10, paddingBottom: 10}]}>{workoutName}</Text>
            <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{'Pushups - 5 sets / 6 reps / 20 secs'}</Text>
            <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{'Body Squats - 5 sets / 6 reps / 20 secs'}</Text>
            <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{'Dips  - 10 reps / 25 lbs'}</Text>
            <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{'Pushups - 5 sets / 6 reps / 20 secs'}</Text>
            <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{'Body Squats - 5 sets / 6 reps / 20 secs'}</Text>
          </View>
        </View>
      )
    })

    return cards
  }

  render() {
    return (
      <View style={common.staticView, {marginTop: 70, marginLeft: 10, marginRight: 10, backgroundColor: COLORS.white}}>
        <View style={[common.row,  { marginTop: 20, marginBottom: 5, justifyContent: 'space-between' }]}>
          <Text style={[common.baseFont, common.lgFont, {marginLeft: 5, color: COLORS.gray10}]}>
            Workouts
          </Text>
        </View>
        <ScrollView style={{paddingTop: 10}}>
          { this.renderWorkoutCards() }
        </ScrollView>
      </View>
    )
  }
}

export default connect(null, null)(DemoScreen)
