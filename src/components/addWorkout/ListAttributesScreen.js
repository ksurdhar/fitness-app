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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Foundation } from '@expo/vector-icons'

import KButton from '../reusable/button'
import Fade from '../reusable/fade'
import Input from '../reusable/input'
import Switch from '../reusable/switch'
import PressCapture from '../reusable/pressCapture'
import { common, COLORS } from '../reusable/common'
import * as workoutActions from '../../redux/actions/workoutActions'

// exerciseData = {} of exerciseNames -> attributes[]
const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
}

class AddWorkoutScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `Attributes`,
    }
  }

  constructor(props) {
    super(props)
    const exerciseData = {}
    const exerciseNames = this.props.navigation.getParam('exerciseNames')
    exerciseNames.forEach((name, idx) => {
      exerciseData[idx] = {
        name,
        attributes: []
      }
    })

    this.state = {
      exerciseData: exerciseData,
      exerciseNames: exerciseNames,
      exerciseIdx: 0
    }
  }

  resetState() {
    this.setState({})
  }

  componentDidUpdate() {
    console.log('state',this.state)
  }

  // addWorkout = () => {
  //   this.props.addWorkout(
  //     this.state.workoutName,
  //     this.state.exerciseData,
  //     this.props.user.uid
  //   )
  //   this.resetState()
  //
  //   const resetAction = StackActions.reset({
  //     index: 0,
  //     actions: [NavigationActions.navigate({ routeName: 'Record' })],
  //   })
  //   this.props.navigation.dispatch(resetAction)
  // }

  handleCapture = () => {
    this.textInput && this.textInput.blur()
  }
  // attributes messed up
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
    return eData && eData.attributes && eData.attributes.indexOf(attrVal) > -1
  }

  isButtonEnabled = (direction) => {
    const spaceLeft = this.state.exerciseIdx > 0
    const spaceRight = this.state.exerciseIdx + 1 < this.state.exerciseNames.length
    const withinBoundary = direction === 'next' ? spaceRight : spaceLeft
    const attrSet = this.state.exerciseData[this.state.exerciseIdx].attributes.length > 0

    return direction === 'next' ? attrSet && withinBoundary : withinBoundary
  }

  goBack = () => {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseIdx = prevState.exerciseIdx - 1
      })
    })
  }

  goForward = () => {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseIdx = prevState.exerciseIdx + 1
      })
    })
  }

  renderSwitches = () => {
    if (this.state.exerciseNames.length > 0) {
      return (
        <View style={{marginTop: 20}}>
          <View style={[common.row, {justifyContent: 'space-around'}]}>
            <View style={{width: 90}}>
              <Switch label={'sets'} onPress={this.handleTogglePress} enabled={this.determineIfToggled('sets')}/>
            </View>
            <View style={{width: 90}}>
              <Switch label={'reps'} onPress={this.handleTogglePress} enabled={this.determineIfToggled('reps')}/>
            </View>
          </View>
          <View style={[common.row, {justifyContent: 'space-around'}]}>
            <View style={{width: 90}}>
              <Switch label={'weight'} onPress={this.handleTogglePress} enabled={this.determineIfToggled('weight')}/>
            </View>
            <View style={{width: 90}}>
              <Switch label={'time'} onPress={this.handleTogglePress} enabled={this.determineIfToggled('time')}/>
            </View>
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  renderButtons = () => {
    return (
      <View style={[common.row, {marginTop: 50}]}>
        <KButton
          style={{width: 70, padding: 4, marginRight: 20, borderRadius: 16}}
          value={<Foundation name={"arrow-left"} size={30} color={COLORS.gray1}/>}
          isEnabled={this.isButtonEnabled('back')}
          onPress={ () => this.goBack() }
        />
        <KButton
          style={{width: 70, padding: 4, marginLeft: 20, borderRadius: 16}}
          value={<Foundation name={"arrow-right"} size={30} color={COLORS.gray1}/>}
          isEnabled={this.isButtonEnabled('next')}
          onPress={ () => this.goForward() }
        />
      </View>
    )
  }

  render() {
    return (
      <View style={[common.staticView]}>
        <View style={[common.row, {marginTop: 10}]}>
          <Text style={[common.tajawal5, {fontSize: 22, color: COLORS.gray10, textAlign: 'center'}]}>
            {`Choose what attributes to \n track for each exercise.`}
          </Text>
        </View>
        <View style={[common.row, {marginTop: 30}]}>
          <Text style={[common.tajawal5, {fontSize: 30, color: COLORS.gray10, textAlign: 'center'}]}>
            {this.state.exerciseNames[this.state.exerciseIdx] + ` (${this.state.exerciseIdx + 1}/${this.state.exerciseNames.length})`}
          </Text>
        </View>
        { this.renderSwitches() }
        { this.renderButtons() }
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
