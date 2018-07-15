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

  constructor() {
    super()
    this.state = {
      exerciseData: {},
      exerciseNames: [],
      exerciseIdx: 0
    }
  }

  componentDidMount() {
    const exerciseData = {}
    const exerciseNames = this.props.navigation.getParam('exerciseNames')
    exerciseNames.forEach((name, idx) => {
      exerciseData[idx] = [{
        name,
        attributes: []
      }]
    })
    this.setState({
      exerciseData,
      exerciseNames
    })
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

  renderSummary = () => {
    function generateAttrStr(attrs) {
      if (attrs.length && attrs.length > 0) {
        let str = ' for '
        attrs.forEach((attr, idx) => {
          if (idx === attrs.length - 1) {
            str = str + attr
          } else {
            str = str + `${attr}, `
          }
        })
        return str
      } else {
        return ''
      }
    }
    const exercises = Object.values(this.state.exerciseData)
    if (exercises.length > 0) {
      exerciseEls = exercises.map((exercise) => {
        return (
          <Fade>
            <View style={common.row}>
              <Text style={[common.baseFont, common.smFont]}>{exercise.name + generateAttrStr(exercise.attributes)}</Text>
            </View>
          </Fade>
        )
      })
    }

    return (
      <View style={{
        minHeight: 130,
        paddingBottom: 10
      }}>
        { workoutName }
        { exerciseEls }
      </View>
    )
  }

  renderSwitches = () => {
    if (this.state.exerciseNames.length > 0) {
      return (
        <View>
        <Switch label={'sets'} onPress={this.handleTogglePress} enabled={this.determineIfToggled('sets')}/>
        <Switch label={'reps'} onPress={this.handleTogglePress} enabled={this.determineIfToggled('reps')}/>
        <Switch label={'weight'} onPress={this.handleTogglePress} enabled={this.determineIfToggled('weight')}/>
        <Switch label={'seconds'}/>
        </View>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <View style={[common.staticView]}>
        <View style={common.row}>
          <Text style={[common.tajawal5, {fontSize: 22, color: COLORS.gray10, textAlign: 'center'}]}>
            {`Choose what attributes to \n track for each exercise.`}
          </Text>
        </View>
        <View style={[common.row]}>
          <Text style={[common.tajawal5, {fontSize: 30, color: COLORS.gray10, textAlign: 'center'}]}>
            {this.state.exerciseNames[this.state.exerciseIdx]}
          </Text>
        </View>
        { this.renderSwitches() }
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
