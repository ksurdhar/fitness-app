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
  TouchableOpacity
} from 'react-native'
import SideSwipe from 'react-native-sideswipe'
import { StackActions, NavigationActions } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Foundation } from '@expo/vector-icons'

import AnimatedText from '../reusable/animatedText'
import KButton from '../reusable/button'
import Fade from '../reusable/fade'
import Input from '../reusable/input'
import Switch from '../reusable/switch'
import PressCapture from '../reusable/pressCapture'
import { common, DYNAMIC } from '../reusable/common'
import * as workoutActions from '../../redux/actions/workoutActions'

// exerciseData = {} of exerciseNames -> attributes[]
const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
}

class ListAttributesScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `Attributes`,
      headerRight: (
        <View style={{paddingRight: 10}}>
          <TouchableOpacity onPress={navigation.getParam('toNameWorkout')} disabled={!navigation.getParam('nextEnabled')}>
            <AnimatedText
              value={'Next'}
              textColors={[DYNAMIC.text10, DYNAMIC.link]}
              isEnabled={navigation.getParam('nextEnabled')}
              style={{fontSize: 18}}
            />
          </TouchableOpacity>
        </View>
      )
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

  componentDidMount() {
    this.props.navigation.setParams({
      nextEnabled: false,
      toNameWorkout: this.toNameWorkout
    })
  }

  componentDidUpdate(prevProps) {
    const nextEnabled = this.props.navigation.getParam('nextEnabled')
    const lastExerciseHasAttr = this.state.exerciseData[this.state.exerciseNames.length - 1].attributes.length > 0

    if (lastExerciseHasAttr && nextEnabled === false) {
      this.props.navigation.setParams({ nextEnabled: true })
    } else if (prevProps.navigation.getParam('nextEnabled') !== false) {
      this.props.navigation.setParams({ nextEnabled: false })
    }
  }

  toNameWorkout = () => {
    this.props.navigation.navigate('NameWorkout', {
      exerciseNames: this.state.exerciseNames,
      exerciseData: this.state.exerciseData
    })
  }

  handleCapture = () => {
    this.textInput && this.textInput.blur()
  }

  handleTogglePress = (label) => {
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
        <View style={{marginTop: 30}}>
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

  render() {
    return (
      <View style={[common.staticView]}>
        <View style={[common.row, {marginTop: 10}]}>
          <Text style={[common.tajawal5, {fontSize: 22, color: DYNAMIC.text10, textAlign: 'center'}]}>
            {`Choose what attributes to \n track for each exercise.`}
          </Text>
        </View>
        <View style={common.row}>
          <Text style={[common.tajawal3, {fontSize: 18, color: DYNAMIC.text8}]}>Hit next when you’ve added them all.</Text>
        </View>
        <View style={[common.row, {marginTop: 30, justifyContent: 'space-between'}]}>
          <KButton
            style={{width: 60, padding: 4, marginLeft: 15, borderRadius: 16}}
            value={"<"}
            isEnabled={this.isButtonEnabled('back')}
            onPress={ () => this.goBack() }
          />
          <Text style={[common.tajawal5, {fontSize: 30, color: DYNAMIC.text10, textAlign: 'center', marginTop: 10}]}>
            {this.state.exerciseNames[this.state.exerciseIdx] + ` (${this.state.exerciseIdx + 1}/${this.state.exerciseNames.length})`}
          </Text>
          <KButton
            style={{width: 60, padding: 4, marginRight: 15, borderRadius: 16}}
            value={">"}
            isEnabled={this.isButtonEnabled('next')}
            onPress={ () => this.goForward() }
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(ListAttributesScreen)
