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
import SideSwipe from 'react-native-sideswipe'

import KButton from './reusable/button'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import { common, COLORS } from './reusable/styles'

DEMO_STATE = {
  carouselIdx: 0,
  exerciseIdx: 0,
  workoutName: '',
  exerciseData: {},
}

DATA = [{name: 'name exercise'}, {name: 'select attributes'}, {name: 'add or finish'}, {name: 'blah blah'}]

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
  }

  resetState() {
    this.setState(DEMO_STATE)
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  componentDidUpdate() {
    // console.log('props', this.props)
    console.log('EXERCISE STATE', this.state.exerciseData)
  }

  changeWorkoutNameHandler(value) {
    this.setState({workoutName: value})
  }

  changeExerciseNameHandler = (value) => {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        const exerciseObj = {
          name: value,
          attributes: []
        }
        draftState.exerciseData[this.state.exerciseIdx] = exerciseObj
      })
    })
  }

  handleCapture() {
    this.textInput && this.textInput.blur()
  }

  isButtonEnabled(direction) {
    const spaceLeft = this.state.carouselIdx - 1 >= 0
    const spaceRight = this.state.carouselIdx + 1 < DATA.length
    const withinBoundary = direction === 'next' ? spaceRight : spaceLeft
    let indexCondition = false
    if (this.state.carouselIdx === 0) {
      indexCondition = this.state.workoutName && this.state.workoutName.length > 0
    }
    if (this.state.carouselIdx === 1) {
      // if the entry exists, a name has been set
      indexCondition = !!this.state.exerciseData[this.state.exerciseIdx]
    }
    if (this.state.carouselIdx === 2) {
      // one attribute must be set
      indexCondition = this.state.exerciseData[this.state.exerciseIdx].attributes.length > 0
    }
    return direction === 'next' ? indexCondition && withinBoundary : withinBoundary
  }

  incrementCarousel() {
    // this should additionally fire an action based upon the index we are currently on
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

  handleTogglePress = (label) => {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        const attrs = prevState.exerciseData[this.state.exerciseIdx].attributes
        const idx = attrs.indexOf(label)
        if (idx === -1) {
          attrs.push(label)
        } else {
          attrs.splice(idx, 1)
        }
        draftState.exerciseData[this.state.exerciseIdx].attributes = attrs
      })
    })
  }

  determineIfToggled = (attrVal) => {
    const eData = this.state.exerciseData[this.state.exerciseIdx]
    return eData && eData.attributes.indexOf(attrVal) > -1
  }

  addExercise = () => {
    // this should also clear out the value of the exercise name input
    this.setState({
      exerciseIdx: this.state.exerciseIdx + 1,
      carouselIdx: 1
    })
  }

  renderCurrentPrompt(idx, item) {
    switch (idx) {
      case 0:
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
      case 1:
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
        break
      case 2:
        return (
          <View>
            <Switch label={'sets'} onPress={this.handleTogglePress} enabled={this.determineIfToggled('sets')}/>
            <Switch label={'reps'} onPress={this.handleTogglePress} enabled={this.determineIfToggled('reps')}/>
            <Switch label={'weight'} onPress={this.handleTogglePress} enabled={this.determineIfToggled('weight')}/>
            <Switch label={'seconds'}/>
          </View>
        )
        break;
        case 3:
          return (
            <View>
              <Button title='Add Another Exercise' onPress={this.addExercise}/>
              <Button title='Submit Workout'/>
            </View>
          )
          break;
    }
  }

  renderSummary = () => {
    let workoutName
    let exerciseEls = []

    if (this.state.carouselIdx > 0) {
      workoutName = <Text style={[common.baseFont, common.smFont]}>{this.state.workoutName}</Text>
    }
    if (this.state.carouselIdx > 1) {
      const exercises = Object.values(this.state.exerciseData)
      if (exercises.length > 0) {
        exerciseEls = exercises.map((exercise) => {
          return <Text style={[common.baseFont, common.smFont]}>{exercise.name}</Text>
        })
      }
    }

    return (
      <View style={{
        height: 180,
        paddingTop: 20
      }}>
        { workoutName }
        { exerciseEls }
      </View>
    )
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
          <View style={[{ width: width - 20, marginRight: 20, height: 140}]}>
            { this.renderCurrentPrompt(itemIndex, item) }
          </View>
        )}
      />
    )
  }

  render() {
    return (
      <View style={[common.staticView, {marginTop: 70}]}>

        { this.renderSummary() }
        <View style={{
          height: 180,
          borderBottomWidth: 2,
          borderTopWidth: 2,
          borderTopColor: COLORS.gray1,
          borderBottomColor: COLORS.gray1,
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
