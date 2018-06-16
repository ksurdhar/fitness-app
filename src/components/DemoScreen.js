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
  mockWorkouts: ['Leg Blasters', 'Ab Destroyers', 'Arm Sculpters'],
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

  // renderPicker() {
  //   const workoutItems = this.state.mockWorkouts.map((name) => {
  //     return <Picker.Item label={name} value={name} key={name}/>
  //   })
  //   return (
  //     <View style={[common.row]}>
  //       <Picker style={{ height: 50, width: 300, paddingBottom: 200 }}
  //         selectedValue={this.state.selectedWorkout}
  //         onValueChange={(val, idx) => this.setState({selectedWorkout: val})}
  //         itemStyle={[common.baseFont, {fontSize: 30}]}>
  //         {workoutItems}
  //       </Picker>
  //     </View>
  //   )
  // }

  renderEmptyMessage = () => {
    return (
      <View style={[common.row, { marginTop: 200 }]}>
        <Text style={[{ fontFamily: 'rubik-medium', fontSize: 24, textAlign: 'center', color: COLORS.gray9 }]}>
          {'You have no workouts yet. \n Try making one!'}
        </Text>
      </View>
    )
  }

  render() {
    const isEmpty = true // replace with state condition
    return (
      <View style={common.staticView, {marginTop: 70}}>
        <View style={[common.row,  { marginTop: 20, justifyContent: 'space-between' }]}>
            <Text style={[common.baseFont, common.lgFont, {marginLeft: 20, color: COLORS.gray10}]}>
              Record
            </Text>
          <KButton
            style={{width: 120, marginRight: 10, top: 9}}
            textColor={COLORS.chill}
            onPress={this.recordSession}
            value={'Add +'}
            isEnabled={true}
            transparent={true}
          />
        </View>
        { isEmpty ? this.renderEmptyMessage() : null }
      </View>
    )
  }
}

export default connect(null, null)(DemoScreen)
