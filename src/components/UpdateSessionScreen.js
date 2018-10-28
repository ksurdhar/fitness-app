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
  TouchableWithoutFeedback
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FontAwesome } from '@expo/vector-icons'

import AnimatedIcon from './reusable/animatedIcon'
import AnimatedText from './reusable/animatedText'
import ExpandingCard from './reusable/expandingCard'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import { common, DYNAMIC } from './reusable/common'
import * as notificationActions from '../redux/actions/notificationActions'
import * as sessionActions from '../redux/actions/sessionActions'
import * as toastActions from '../redux/actions/toastActions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    workouts: state.workouts.workouts,
    sessions: state.sessions.sessions
  }
}

//   Object {
//   "igp47m": Object {
//     "attributes": Array [
//       Object {
//         "type": "sets",
//         "val": "4",
//       },
//     ],
//     "id": "igp47m",
//     "name": "pushups",
//   },
// }

class UpdateSessionScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state

    return {
      title: `Session Date`, // maybe add info about workout type
      headerRight: (
        <View style={{paddingRight: 10}}>
          <TouchableOpacity onPress={navigation.getParam('updateSession')} disabled={false}>
            <AnimatedText
              value={'Update'}
              textColors={[DYNAMIC.black10, DYNAMIC.link]}
              isEnabled={true} // update with logic checking all vals
              style={{fontSize: 18, fontFamily: 'rubik'}}
            />
          </TouchableOpacity>
        </View>
      )
    }
  }

  constructor() {
    super()

    this.state = {
      exerciseNames: [],
      exerciseData: {},
      noteText: ''
    }
  }

  resetState() {
    this.setState({
      exerciseNames: [],
      exerciseData: {},
      noteText: ''
    })
  }

  componentDidMount() {
    const params = this.props.navigation.state.params
    const exerciseNames = Object.entries(params.session.exercises).map(([eIdx, exercise]) => {
      return exercise.name
    })

    this.setState({
      exerciseData: params.session.exercises,
      exerciseNames: exerciseNames
    })

    this.props.navigation.setParams({
      // nextEnabled: false,
      updateSession: this.updateSession
    })
  }

  componentDidUpdate() {
    // console.log('state',this.state)
  }

  updateSession = () => {
    const sessionToUpdate = this.props.navigation.state.params.session
    sessionToUpdate.exercises = this.state.exerciseData
    this.props.user.uid,
    this.props.updateSession(sessionToUpdate.id, this.props.user.uid, sessionToUpdate)
    this.resetState()
    this.props.openToast('Workout entry updated.')
    this.props.navigation.navigate('Workouts')
  }

  handleCapture = () => {
    Object.entries(this.state.exerciseData).forEach(([exKey, exercise]) => {
      exercise.attributes.forEach((attribute, attrIdx) => {
        this[`${exKey}-${attrIdx}-input`] && this[`${exKey}-${attrIdx}-input`].blur()
      })
    })
  }

  setAttrVal(exKey, attrIdx, val) {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseData[exKey].attributes[attrIdx].val = val
      })
    })
  }

  renderAttrInputs(exKey, attributes) {
    return attributes.map((attr, attrIdx) => {
      const labelElement = (
        <Text style={{
          fontFamily: 'rubik',
          fontSize:20,
          color: DYNAMIC.black7
        }}>
          { attr.type }
        </Text>
      )

      return (
        <View key={attrIdx} style={{paddingTop: 20}}>
          <Input
            value={attr.val}
            label={labelElement}
            subLabel={''}
            onChangeText={this.setAttrVal.bind(this, exKey, attrIdx)}
            ref={(element) => { this[`${exKey}-${attrIdx}-input`] = element }}
            fontSize={24}
            isValid={attr.val && attr.val.length > 0}
            fixedLabel={true}
            animate={true}
            keyboardType={'numeric'}
          />
        </View>
      )
    })
  }

  cardComplete = (exKey) => {
    return this.state.exerciseData[exKey].attributes.every((attr) => {
      return attr.val && attr.val.length > 0
    })
  }

  renderExercises = () => {
    return Object.entries(this.state.exerciseData).map(([exKey, exercise]) => {
      const completeEl = (
        <AnimatedIcon
          icon1={<FontAwesome name={'check'} color={DYNAMIC.black1} size={30}/>}
          icon2={<FontAwesome name={'check'} color={DYNAMIC.green7} size={30}/>}
          isEnabled={this.cardComplete(exKey)}
          size={30}
          style={{marginTop: -6}}
        />
      )
      return (
        <ExpandingCard
          key={exKey}
          header={exercise.name}
          expandable={false}
          cardHeights={[600, 600]}
          rightCorner={completeEl}
        >
          { this.renderAttrInputs(exKey, exercise.attributes) }
        </ExpandingCard>
      )
    })
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
        onChangeText={(val) => { this.setState({ noteText: val }) }}
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
        <View style={[common.staticView, { paddingLeft: 10, paddingRight: 10, backgroundColor: DYNAMIC.primary1, height: height }]}>
          <KeyboardAwareScrollView style={{paddingTop: 10}}>
          { this.renderExercises() }
          </KeyboardAwareScrollView>
        </View>
      </PressCapture>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSession:(sessionID, userID, patchObj) => { dispatch(sessionActions.updateSession(sessionID, userID, patchObj)) },
    openToast: (message) => { dispatch(toastActions.openToast({ toastString: message }))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSessionScreen)
