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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FontAwesome } from '@expo/vector-icons'

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

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    workouts: state.workouts.workouts,
    sessions: state.sessions.sessions
  }
}

class UpdateSessionScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state

    return {
      title: `Update`, // maybe add info about workout type
      tabBarLabel: 'Record',
      tabBarIcon: ({ tintColor }) => (
        <Text>Record</Text>
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
    console.log('SESSION', params.session.exercises)

    const exerciseNames = Object.entries(params.session.exercises).map(([eIdx, exercise]) => {
      return exercise.name
    })

    this.setState({
      exerciseData: params.session.exercises,
      exerciseNames: exerciseNames
    })
  }

  componentDidUpdate() {
    // console.log('state',this.state)
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

  renderAttrInputs(exIdx, exVal) {
    return <Text>hey</Text>
    // return Object.entries(this.state.exerciseData[exIdx]).map(([attrIdx, attr]) => {
    //   const labelElement = (
    //     <Text style={{
    //       fontFamily: 'rubik-medium',
    //       fontSize:20,
    //       color: DYNAMIC.text7
    //     }}>
    //       {attr.type}
    //     </Text>
    //   )
    //
    //   const attrVal = this.state.exerciseData[exIdx][attrIdx].val
    //   return (
    //     <View key={attrIdx} style={{paddingTop: 20}}>
    //       <Input
    //         value={attrVal}
    //         label={labelElement}
    //         subLabel={''}
    //         onChangeText={this.setAttrVal.bind(this, exIdx, attrIdx)}
    //         ref={(element) => { this[`${exIdx}-${attrIdx}-input`] = element }}
    //         fontSize={24}
    //         isValid={attrVal && attrVal.length > 0}
    //         fixedLabel={false}
    //         animate={true}
    //         keyboardType={'numeric'}
    //       />
    //     </View>
    //   )
    // })
  }

  cardComplete = (exIdx) => {
    return true
    // return Object.entries(this.state.exerciseData[exIdx]).every(([attrIdx, attr]) => {
    //   return attr.val && attr.val.length > 0
    // })
  }

  renderExercises = () => {
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
  // { this.renderNoteCard() }

  render() {
    const { width, height } = Dimensions.get('window')

    return (
      <PressCapture onPress={this.handleCapture}>
        <View style={[common.staticView, { paddingLeft: 10, paddingRight: 10, backgroundColor: DYNAMIC.foreground5, height: height }]}>
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
    updateNotification: (workoutID, patchObj) => { dispatch(notificationActions.updateNotification(workoutID, patchObj))},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateSessionScreen)
