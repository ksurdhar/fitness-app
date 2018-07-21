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

import Input from '../reusable/input'
import PressCapture from '../reusable/pressCapture'
import { common, COLORS } from '../reusable/common'
import * as workoutActions from '../../redux/actions/workoutActions'

class NameWorkout extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `Name`
    }
  }

  constructor() {
    super()
    this.state = {
      currentName: '',
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
    return (
      <View style={[common.staticView]}>
        <KeyboardAwareScrollView style={{flex:1, justifyContent: 'start'}}>
          <View style={[common.row, {marginTop: 10}]}>
            <Text style={[common.tajawal5, {fontSize: 22, color: COLORS.gray10, textAlign: 'center'}]}>
              {`Finally, give your workout \n a good name.`}
            </Text>
          </View>
          <Input
            value={this.state.currentName}
            labelText='Workout Name'
            onChangeText={this.changeNameHandler}
            ref={(element) => { this.input = element }}
            small={true}
            style={{marginBottom: 20, width: width - 20, marginTop: 100}}
            fixedLabel={true}
          />
          <View style={[common.row]}>
            <TouchableOpacity onPress={this.addWorkout}>
              <MaterialIcons
                name={"add-circle"}
                size={32} color={COLORS.peach}
                style={{top: -62, left: width/2 - 26, backgroundColor: 'transparent'}}
              />
            </TouchableOpacity>
          </View>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NameWorkout)
