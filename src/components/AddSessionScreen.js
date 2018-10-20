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
import { format, addDays } from 'date-fns'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FontAwesome } from '@expo/vector-icons'
import { StackActions, NavigationActions } from 'react-navigation'

import AnimatedIcon from './reusable/animatedIcon'
import AnimatedText from './reusable/animatedText'
import ExpandingCard from './reusable/expandingCard'
import KButton from './reusable/button'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import { common, DYNAMIC } from './reusable/common'
import * as notificationActions from '../redux/actions/notificationActions'
import * as sessionActions from '../redux/actions/sessionActions'
import { openToast } from '../redux/actions/toastActions'

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

ADD_SESSION_STATE = {
  workoutName: '',
  exerciseNames: [],
  exerciseData: {},
  noteText: ''
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    workouts: state.workouts.workouts,
    sessions: state.sessions.sessions
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
    this.state = ADD_SESSION_STATE
  }

  resetState() {
    this.setState(ADD_SESSION_STATE)
  }

  componentDidMount() {
    const params = this.props.navigation.state.params
    const prevSession = this.findPreviousSession(params.workoutID)

    this.setState({
      workoutID: params.workoutID,
      workoutName: params.workoutName,
      exerciseData: params.exerciseData,
      exerciseNames: params.exerciseNames,
      prevSession
    })
  }

  componentDidUpdate() {
    // console.log('state',this.state)
  }

  findPreviousSession = (workoutID) => {
    let mostRecentSession = { date: 0 }
    this.props.sessions.forEach((session) => {
      if (session.workoutID == workoutID && session.date > mostRecentSession.date) {
        mostRecentSession = session
      }
    })
    if (mostRecentSession.date > 0) {
      return mostRecentSession
    } else {
      return null
    }
  }

  addSession = () => {
    this.props.addSession(
      this.state.exerciseNames,
      this.state.exerciseData,
      this.props.user.uid,
      this.state.workoutID,
      this.state.workoutName,
      this.state.noteText
    )
    // update notification delivery date if enabled
    const workout = this.props.workouts.find((workout) => {
      return workout.id === this.state.workoutID
    })
    if (workout.notificationsEnabled) {
      const dateObj = addDays(new Date(), workout.notificationInterval)
      this.props.updateNotification(this.state.workoutID, {
        month: dateObj.getUTCMonth() ,
        day: dateObj.getUTCDate(),
      })
    }
    // reset state
    this.resetState()
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Record' })],
    })
    this.props.navigation.dispatch(resetAction)
    this.props.navigation.navigate('Workouts')
    this.props.openToast(`${this.state.workoutName} workout recorded.`)
  }

  handleCapture = () => {
    this.state.exerciseNames.forEach((name, exIdx) => {
      Object.entries(this.state.exerciseData[exIdx]).forEach(([attrIdx, attr]) => {
        this[`${exIdx}-${attrIdx}-input`] && this[`${exIdx}-${attrIdx}-input`].blur()
      })
    })
  }

  getPreviousValueForAttr = (exName, attrType) => {
    let prevVal
    if (attrType && this.state.prevSession) {
      Object.entries(this.state.prevSession.exercises).forEach(([prevExID, prevExObj]) => {
        // finding the correct exercise
        if (prevExObj.name == exName) {
          prevExObj.attributes.forEach((prevAttrObj) => {
            // finding the correct value for type
            if (prevAttrObj.type == attrType) {
              prevVal = prevAttrObj.val
            }
          })
        }
      })
    }
    return prevVal
  }

  setAttrVal(exIdx, attrIdx, val) {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseData[exIdx][attrIdx].val = val
      })
    })
  }
  // make keyboard type numeric
  renderAttrInputs(exIdx, exVal) {
    return Object.entries(this.state.exerciseData[exIdx]).map(([attrIdx, attr]) => {
      const labelElement = (
        <Text style={{
          fontFamily: 'rubik-medium',
          fontSize:20,
          color: DYNAMIC.text7
        }}>
          {attr.type}
        </Text>
      )

      const attrVal = this.state.exerciseData[exIdx][attrIdx].val
      const prevVal = this.getPreviousValueForAttr(exVal, attr.type)
      return (
        <View key={attrIdx} style={{paddingTop: 20}}>
          <Input
            value={attrVal}
            label={labelElement}
            subLabel={ prevVal ? `${prevVal} previously` : '' }
            onChangeText={this.setAttrVal.bind(this, exIdx, attrIdx)}
            ref={(element) => { this[`${exIdx}-${attrIdx}-input`] = element }}
            fontSize={24}
            isValid={attrVal && attrVal.length > 0}
            fixedLabel={false}
            animate={true}
            keyboardType={'numeric'}
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
            icon1={<FontAwesome name={'check'} color={DYNAMIC.text1} size={30}/>}
            icon2={<FontAwesome name={'check'} color={DYNAMIC.green7} size={30}/>}
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
            { this.renderAttrInputs(exIdx, val) }
          </ExpandingCard>
        )
      })
    } else {
      return null
    }
  }

  renderNoteCard = () => {
    return (
      <ExpandingCard
        key={'notes'}
        header={'Notes'}
        expandable={false}
        cardHeights={[600, 600]}
      >
      <Input
        value={this.state.noteText}
        onChangeText={(val) => { this.setState({noteText: val}) }}
        fontSize={20}
        fixedLabel={false}
        animate={false}
        multiline={true}
        numberOfLines={4}
      />
      </ExpandingCard>
    )
  }

  render() {
    const { width, height } = Dimensions.get('window')

    return (
      <PressCapture onPress={this.handleCapture}>
        <View style={[common.staticView, { paddingLeft: 10, paddingRight: 10, backgroundColor: DYNAMIC.foreground5, height: height }]}>
          <KeyboardAwareScrollView style={{paddingTop: 10}}>
            { this.renderExercises() }
            { this.renderNoteCard() }
            <View style={[common.row]}>
              <TouchableOpacity onPress={() => this.addSession() }>
                <View style={{padding: 14, backgroundColor: DYNAMIC.link}}>
                  <Text style={{fontSize: 24, fontFamily: 'rubik-medium', textAlign: 'center', color: DYNAMIC.foreground}}>
                    Record
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
    addSession: (exerciseNames, exerciseData, uid, workoutID, workoutName, noteText) => { dispatch(sessionActions.addSession(exerciseNames, exerciseData, uid, workoutID, workoutName, noteText)) },
    updateNotification: (workoutID, patchObj) => { dispatch(notificationActions.updateNotification(workoutID, patchObj))},
    openToast: (message) => { dispatch(openToast({ toastString: message }))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSessionScreen)
