import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'

import {
  ScrollView,
  Dimensions,
  Animated,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Button,
  TouchableWithoutFeedback
} from 'react-native'
import { format } from 'date-fns'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FontAwesome } from '@expo/vector-icons'
import { StackActions, NavigationActions } from 'react-navigation'

import AnimatedIcon from './reusable/animatedIcon'
import ExpandingCard from './reusable/expandingCard'
import KButton from './reusable/button'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import { common, COLORS } from './reusable/common'
import * as sessionActions from '../redux/actions/sessionActions'

// SHAPE OF EXERCISE DATA
// Object {
//   "0": Object {
//     "0": Object {
//       "type": "sets",
//       "val": null,
//     },
//     "1": Object {
//       "type": "reps",
//       "val": null,
//     },
//   },
// }

INITIAL_STATE = {
  workoutName: '',
  exerciseNames: [],
  exerciseData: {},
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
}

class AddSessionScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state

    return {
      title: `Recording ${params.workoutName}`,
      tabBarLabel: 'Record',
      tabBarIcon: ({ tintColor }) => (
        <Text>Record</Text>
      )
    }
  }

  constructor() {
    super()
    this.state = INITIAL_STATE
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  componentDidMount() {
    const params = this.props.navigation.state.params
    this.setState({
      workoutID: params.workoutID,
      workoutName: params.workoutName,
      exerciseData: params.exerciseData,
      exerciseNames: params.exerciseNames,
    })
  }

  componentDidUpdate() {
    console.log('state',this.state)
  }

  addSession() {
    this.props.addSession(
      this.state.exerciseNames,
      this.state.exerciseData,
      this.props.user.uid,
      this.state.workoutID,
      this.state.workoutName
    )
    this.resetState()
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Record' })],
    })
    this.props.navigation.dispatch(resetAction)
    this.props.navigation.navigate('Workouts')
  }

  handleCapture = () => {
    this.state.exerciseNames.forEach((name, exIdx) => {
      Object.entries(this.state.exerciseData[exIdx]).forEach(([attrIdx, attr]) => {
        this[`${exIdx}-${attrIdx}-input`] && this[`${exIdx}-${attrIdx}-input`].blur()
      })
    })
  }

  setAttrVal(exIdx, attrIdx, val) {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseData[exIdx][attrIdx].val = val
      })
    })
  }
  // make keyboard type numeric
  renderAttrInputs(exIdx) {
    return Object.entries(this.state.exerciseData[exIdx]).map(([attrIdx, attr]) => {
      const labelElement = (
        <Text style={{
          fontFamily: 'rubik-medium',
          fontSize:20,
          color: COLORS.gray7
        }}>
          {attr.type}
        </Text>
      )
      const attrVal = this.state.exerciseData[exIdx][attrIdx].val
      return (
        <View key={attrIdx} style={{paddingTop: 20}}>
          <Input
            value={attrVal}
            label={labelElement}
            onChangeText={this.setAttrVal.bind(this, exIdx, attrIdx)}
            ref={(element) => { this[`${exIdx}-${attrIdx}-input`] = element }}
            fontSize={24}
            isValid={attrVal && attrVal.length > 0}
            fixedLabel={false}
          />
        </View>
      )
    })
  }

  cardComplete = (exIdx) => {
    return Object.entries(this.state.exerciseData[exIdx]).every(([attrIdx, attr]) => {
      return attr.val && attr.val.length > 0
    })
  }

  renderExercises = () => {
    if (this.state.exerciseNames) {
      return this.state.exerciseNames.map((val, exIdx) => {
        const completeEl = (
          <AnimatedIcon
            icon1={<FontAwesome name={'check'} color={COLORS.gray1} size={30}/>}
            icon2={<FontAwesome name={'check'} color={COLORS.celestialGreen7} size={30}/>}
            isEnabled={this.cardComplete(exIdx)}
            size={30}
            style={{marginTop: -6}}
          />
        )
        return (
          <ExpandingCard
            key={exIdx}
            header={val}
            expandable={false}
            cardHeights={[600, 600]}
            rightCorner={completeEl}
          >
            { this.renderAttrInputs(exIdx) }
          </ExpandingCard>
        )
      })
    } else {
      return null
    }
  }

  render() {
    const { width, height } = Dimensions.get('window')

    return (
      <PressCapture onPress={this.handleCapture}>
        <View style={[common.staticView, { paddingLeft: 10, paddingRight: 10, backgroundColor: COLORS.white, height: height }]}>
          <KeyboardAwareScrollView style={{paddingTop: 10}}>
            { this.renderExercises() }
            <View style={[common.row]}>
              <TouchableOpacity onPress={() => this.addSession() }>
                <View style={{padding: 14, backgroundColor: COLORS.peach}}>
                  <Text style={{fontSize: 24, fontFamily: 'rubik-medium', textAlign: 'center', color: COLORS.white}}>
                    Record Session
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </PressCapture>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addSession: (exerciseNames, exerciseData, uid, workoutID, workoutName) => { dispatch(sessionActions.addSession(exerciseNames, exerciseData, uid, workoutID, workoutName)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSessionScreen)
