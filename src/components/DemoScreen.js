import React from 'react'
import { connect } from 'react-redux'
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
import SideSwipe from 'react-native-sideswipe'

import KButton from './reusable/button'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import { common, COLORS } from './reusable/styles'

DEMO_STATE = {
  carouselIdx: 0,
  workoutName: '',
  exerciseName: ''
}

DATA = [{name: 'name exercise'}, {name: 'select attributes'}, {name: 'add or finish'}]

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

    this.isButtonEnabled = this.isButtonEnabled.bind(this)
    this.handleCapture = this.handleCapture.bind(this)
    this.renderCarousel = this.renderCarousel.bind(this)
    this.incrementCarousel = this.incrementCarousel.bind(this)
    this.decrementCarousel = this.decrementCarousel.bind(this)
    this.renderCurrentPrompt = this.renderCurrentPrompt.bind(this)
    this.changeWorkoutNameHandler = this.changeWorkoutNameHandler.bind(this)
    this.changeExerciseNameHandler = this.changeExerciseNameHandler.bind(this)
  }

  resetState() {
    this.setState(DEMO_STATE)
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  componentDidUpdate() {
    // console.log('props', this.props)
  }

  changeWorkoutNameHandler(value) {
    this.setState({workoutName: value})
  }

  changeExerciseNameHandler(value) {
    this.setState({exerciseName: value})
  }

  handleCapture() {
    this.textInput && this.textInput.blur()
  }

  isButtonEnabled(direction) {
    const spaceLeft = this.state.carouselIdx - 1 >= 0
    const spaceRight = this.state.carouselIdx + 1 < DATA.length
    const withinBoundary = direction === 'next' ? spaceRight : spaceLeft
    let indexCondition
    if (this.state.carouselIdx === 0) {
      indexCondition = true
    }
    if (this.state.carouselIdx === 1) {
      indexCondition = this.state.workoutName && this.state.workoutName.length > 0
    }
    if (this.state.carouselIdx === 2) {
      indexCondition = this.state.exerciseName && this.state.exerciseName.length

    }
    return direction === 'next' ? indexCondition && withinBoundary : withinBoundary
  }

  incrementCarousel() {
    if (this.state.carouselIdx + 1 < DATA.length) {
      this.setState({
        carouselIdx: this.state.carouselIdx + 1
      })
    }
  }

  decrementCarousel() {
    if (this.state.carouselIdx - 1 >= 0) {
      this.setState({
        carouselIdx: this.state.carouselIdx - 1
      })
    }
  }

  renderCurrentPrompt(idx, item) {
    switch (idx) {
      case 0:
        return (
          <Switch label={'sets'}/>
        )
      case 1:
        return (
          <Input
            value={this.state.workoutName}
            labelText='Name Your Workout:'
            onChangeText={this.changeWorkoutNameHandler}
            ref={(element) => { this.input1 = element }}
            small={true}
            fixedLabel={true}
            style={{marginBottom: 20}}
          />
        )
        break;
      case 2:
        return (
          <Input
            value={this.state.exerciseName}
            labelText='Name An Exercise:'
            onChangeText={this.changeExerciseNameHandler}
            ref={(element) => { this.input2 = element }}
            small={true}
            fixedLabel={true}
            style={{marginBottom: 20}}
          />
        )
        break;
    }
  }

  renderCarousel() { // carousel does not work with pressCapture component
    const { width } = Dimensions.get('window');

    return (
      <SideSwipe
        index={this.state.carouselIdx}
        itemWidth={width}
        style={{ width: width }}
        data={DATA}
        useNativeDriver={true}
        onIndexChange={index => {
          this.setState(() => ({ carouselIdx: index }))
        }}
        renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
          <View style={[{ width: width - 20, marginRight: 20, height: 100}]}>
            { this.renderCurrentPrompt(itemIndex, item) }
          </View>
        )}
      />
    )
  }

  render() {
    return (
      <View style={[common.staticView, {marginTop: 70}]}>
        <View style={{
          height: 180,
          borderBottomWidth: 2,
          borderTopWidth: 2,
          borderTopColor: COLORS.gray1,
          borderBottomColor: COLORS.gray1,
          marginTop: 150,
          marginBottom: 20,
          paddingTop: 20
        }}>
          { this.renderCarousel() }
        </View>
        <View style={[common.row, {justifyContent: 'space-around'}]}>
          <KButton
            style={{width: 100, padding: 4}}
            value={'<'}
            isEnabled={this.isButtonEnabled('back')}
            onPress={ () => this.decrementCarousel() }
          />
          <KButton
            style={{width: 100, padding: 4}}
            value={'>'}
            isEnabled={this.isButtonEnabled('next')}
            onPress={ () => this.incrementCarousel() }
          />
        </View>
      </View>
    )
  }
}

export default connect(null, null)(DemoScreen)
