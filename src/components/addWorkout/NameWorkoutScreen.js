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
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { MaterialIcons } from '@expo/vector-icons'

import AnimatedText from '../reusable/animatedText'
import Input from '../reusable/input'
import PressCapture from '../reusable/pressCapture'
import { common, DYNAMIC } from '../reusable/common'
import * as workoutActions from '../../redux/actions/workoutActions'
import { openToast } from '../../redux/actions/toastActions'

class NameWorkout extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Name Workout',
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam('addWorkout')} disabled={!navigation.getParam('nextEnabled')}>
          <View style={{paddingRight: 10}}>
            <AnimatedText
              value={'Create'}
              textColors={[DYNAMIC.black3, DYNAMIC.link]}
              isEnabled={navigation.getParam('nextEnabled')}
              style={{fontSize: 18, fontFamily: 'rubik'}}
            />
          </View>
        </TouchableOpacity>
      )
    }
  }

  constructor() {
    super()
    this.state = {
      currentName: '',
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      nextEnabled: false,
      addWorkout: this.addWorkout
    })
  }

  componentDidUpdate(prevProps) {
    const nextEnabled = this.props.navigation.getParam('nextEnabled')
    const nameHasLength = this.state.currentName.length > 1

    if (nameHasLength && nextEnabled === false) {
      this.props.navigation.setParams({ nextEnabled: true })
    } else if (prevProps.navigation.getParam('nextEnabled') !== false) {
      this.props.navigation.setParams({ nextEnabled: false })
    }
  }

  addWorkout = () => {
    const eData = this.props.navigation.getParam('exerciseData')
    this.props.addWorkout(
      this.state.currentName,
      eData,
      this.props.user.uid
    )

    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Record' })],
    })
    this.props.openToast('Workout type created.')
    this.props.navigation.dispatch(resetAction)
  }

  changeNameHandler = (value) => {
    this.setState({currentName: value})
  }

  handleCapture = () => {
    this.textInput && this.textInput.blur()
  }

  render() {
    const { width, height } = Dimensions.get('window')
    const labelEl = (
      <Text style={{
        fontFamily: 'rubik',
        fontSize:20,
        color: DYNAMIC.black7
      }}>
        Workout Name
      </Text>
    )
    return (
      <View style={[common.staticView, { backgroundColor: DYNAMIC.white }]}>
        <KeyboardAwareScrollView style={{flex:1, justifyContent: 'start'}}>
          <View style={[common.row, {marginTop: 10}]}>
            <Text style={[common.tajawal5, {fontSize: 22, color: DYNAMIC.black10, textAlign: 'center'}]}>
              {`Finally, give your workout \n a good name.`}
            </Text>
          </View>
          <Input
            value={this.state.currentName}
            label={labelEl}
            onChangeText={this.changeNameHandler}
            ref={(element) => { this.input = element }}
            style={{width: width - 20, marginTop: 100}}
            fixedLabel={true}
            fontSize={24}
            animate={false}
          />
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addWorkout: (workoutName, exerciseData, uid) => {
      dispatch(workoutActions.addWorkout(workoutName, exerciseData, uid))
    },
    openToast: (message) => { dispatch(openToast({ toastString: message }))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NameWorkout)
