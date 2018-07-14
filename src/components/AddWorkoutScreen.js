import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import {
  Keyboard,
  Dimensions,
  Animated,
  Button,
  View,
  Text,
} from 'react-native'
import SideSwipe from 'react-native-sideswipe'
import { StackActions, NavigationActions } from 'react-navigation'

import KButton from './reusable/button'
import Fade from './reusable/fade'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import { common, COLORS } from './reusable/common'
import * as workoutActions from '../redux/actions/workoutActions'




// exerciseData = {} of exerciseNames -> attributes[]
ADD_WORKOUT_STATE = {
  carouselIdx: 0,
  exerciseIdx: 0,
  workoutName: '',
  tempEName: '',
  exerciseData: {},
}

CAROUSEL_LENGTH = 4

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
}

class AddWorkoutScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `Defining Workout`,
      tabBarLabel: 'Record',
      tabBarIcon: ({ tintColor }) => (
        <Text>Record</Text>
      )
    }
  }

  constructor() {
    super()
    this.state = ADD_WORKOUT_STATE
  }

  resetState() {
    this.setState(ADD_WORKOUT_STATE)
  }

  componentDidUpdate() {
    // console.log('state',this.state)
  }

  addWorkout = () => {
    this.props.addWorkout(
      this.state.workoutName,
      this.state.exerciseData,
      this.props.user.uid
    )
    this.resetState()

    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Record' })],
    })
    this.props.navigation.dispatch(resetAction)
  }

  changeWorkoutNameHandler = (value) => {
    this.setState({workoutName: value})
  }

  changeExerciseNameHandler = (value) => {
    this.setState({tempEName: value})
  }

  handleCapture = () => {
    this.textInput && this.textInput.blur()
  }

  isButtonEnabled = (direction) => {
    const spaceLeft = this.state.carouselIdx - 1 >= 0
    const spaceRight = this.state.carouselIdx + 1 < CAROUSEL_LENGTH
    const withinBoundary = direction === 'next' ? spaceRight : spaceLeft
    let indexCondition = false
    if (this.state.carouselIdx === 0) {
      indexCondition = this.state.workoutName && this.state.workoutName.length > 0
    }
    if (this.state.carouselIdx === 1) {
      // user has supplied a name
      indexCondition = this.state.tempEName && this.state.tempEName.length > 0
    }
    if (this.state.carouselIdx === 2) {
      // one attribute must be set
      indexCondition = this.state.exerciseData[this.state.exerciseIdx].attributes.length > 0
    }
    return direction === 'next' ? indexCondition && withinBoundary : withinBoundary
  }

  incrementCarousel = () => {
    // additionally fires an action based upon the index we are currently on
    if (this.state.carouselIdx + 1 < CAROUSEL_LENGTH) {
      this.setState({
        carouselIdx: this.state.carouselIdx + 1
      })
    }
    if (this.state.carouselIdx === 1) {
      // adds exercise data to state, resets temp exercise name
      this.setState((prevState) => {
        return produce(prevState, (draftState) => {
          const exerciseObj = {
            name: prevState.tempEName,
            attributes: []
          }
          draftState.exerciseData[this.state.exerciseIdx] = exerciseObj
          draftState.tempEName = ''
        })
      })
    }
  }

  decrementCarousel = () => {
    if (this.state.carouselIdx - 1 >= 0) {
      this.setState({
        carouselIdx: this.state.carouselIdx - 1
      })
    }
  }

  handleTogglePress = (label) => {
    // toggles attribute on an exercise
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        const attrs = prevState.exerciseData[this.state.exerciseIdx].attributes
        const idx = attrs.indexOf(label)
        idx === -1 ? attrs.push(label) : attrs.splice(idx, 1)
        draftState.exerciseData[this.state.exerciseIdx].attributes = attrs
      })
    })
  }

  determineIfToggled = (attrVal) => {
    const eData = this.state.exerciseData[this.state.exerciseIdx]
    return eData && eData.attributes.indexOf(attrVal) > -1
  }

  addExercise = () => {
    this.setState({
      exerciseIdx: this.state.exerciseIdx + 1,
      carouselIdx: 1
    })
  }

  renderCurrentPrompt = (idx, item) => {
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
            value={this.state.tempEName}
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
              <Button title='Submit Workout' onPress={this.addWorkout}/>
            </View>
          )
          break;
    }
  }

  renderSummary = () => {
    let workoutName
    let exerciseEls = []

    if (this.state.carouselIdx > 0) {
      workoutName = (
        <Fade>
          <Text style={[common.baseFont, {fontSize: 24, textDecorationLine: 'underline', textDecorationColor: COLORS.gray5}]}>{this.state.workoutName}</Text>
        </Fade>
      )
    }
    const exercises = Object.values(this.state.exerciseData)
    if (exercises.length > 0) {
      exerciseEls = exercises.map((exercise) => {
        return (
          <Fade>
            <Text style={[common.baseFont, common.smFont]}>{exercise.name}</Text>
          </Fade>
        )
      })
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

  renderCarousel = () => { // carousel does not work with pressCapture component
    const { width } = Dimensions.get('window');

    return (
      <SideSwipe
        index={this.state.carouselIdx}
        itemWidth={width}
        style={{ width: width }}
        data={[1,2,3,4]}
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
      <View style={[common.staticView]}>
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

const mapDispatchToProps = (dispatch) => {
  return {
    addWorkout: (workoutName, exerciseData, uid) => {
      dispatch(workoutActions.addWorkout(workoutName, exerciseData, uid))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddWorkoutScreen)
