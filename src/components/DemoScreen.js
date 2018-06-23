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

import Card from './reusable/card'
import KButton from './reusable/button'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import Fade from './reusable/fade'
import { common, COLORS } from './reusable/styles'

// ['Leg Blasters', 'Ab Crunches', 'Arm Destroyer', 'Leg Blasters', 'Ab Crunches', 'Arm Destroyer']
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

  renderEmptyView = () => {
    const { height } = Dimensions.get('window')

    return (
      <View style={[common.row, { marginTop: 160, height: height }]}>
        <Text style={{ fontFamily: 'rubik-medium', fontSize: 24, textAlign: 'center', color: COLORS.gray5 }}>
          {'You have no recorded workouts.'}
        </Text>
      </View>
    )
  }

  // drop shadow requires there to be a background color
  renderWorkoutCards = () => {
    const cards = this.state.mockWorkouts.map((workoutName) => {
      const dateString = format(new Date(), 'dddd, MMM D [at] h:mm A')
      const view1 = (
        <View>
          <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{'Pushups - 5 sets / 6 reps / 20 secs'}</Text>
          <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{'Pushups - 5 sets / 6 reps / 20 secs'}</Text>
          <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{'Pushups - 5 sets / 6 reps / 20 secs'}</Text>
          <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{'Pushups - 5 sets / 6 reps / 20 secs'}</Text>
        </View>
      )
      const view2 = (
        <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>
          Felt pretty good today, but havent gotten to touch samms butt enough. This is likely making it harder to workout.
        </Text>
      )
      return (
        <Card subHeader={dateString} header={workoutName} view1={view1} view2={view2}/>
      )
    })

    return (
      <ScrollView style={{paddingTop: 10}}>
        { cards }
      </ScrollView>
    )
  }

  render() {
    return (
      <View style={common.staticView, {marginTop: 70, marginLeft: 10, marginRight: 10, backgroundColor: COLORS.white}}>
        <View style={[common.row,  { marginTop: 20, marginBottom: 5, justifyContent: 'space-between' }]}>
          <Text style={[common.baseFont, common.lgFont, {marginLeft: 5, color: COLORS.gray10}]}>
            Workouts
          </Text>
        </View>
        {
          this.state.mockWorkouts.length > 0 ?
          this.renderWorkoutCards() :
          this.renderEmptyView()
        }
      </View>
    )
  }
}

export default connect(null, null)(DemoScreen)
