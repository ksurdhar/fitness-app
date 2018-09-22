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
import { common, DYNAMIC } from '../reusable/common'

class ListExercisesScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `Exercises`,
      headerRight: (
        <View style={{paddingRight: 10}}>
          <Button
            title="Next"
            onPress={navigation.getParam('toListAttributes')}
          />
        </View>
      )
    }
  }

  constructor() {
    super()
    this.state = {
      currentName: '',
      exerciseNames: ['pushups', 'pullups']
    }
  }

  resetState() {
    this.setState({
      exerciseNames: []
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({ toListAttributes: this.toListAttributes })
  }

  toListAttributes = () => {
    this.props.navigation.navigate('ListAttributes', {
      exerciseNames: this.state.exerciseNames
    })
  }

  changeExerciseNameHandler = (value) => {
    this.setState({currentName: value})
  }

  handleCapture = () => {
    this.textInput && this.textInput.blur()
  }

  addExercise = () => {
    this.setState({
      exerciseNames: this.state.exerciseNames.concat([this.state.currentName]),
      currentName: ''
    })

    setTimeout(() => {
      this.pillContainer.scrollToEnd()
    }, 100)
  }

  renderExercises = () => {
    return this.state.exerciseNames.map((e) => {
      return (
        <View style={[common.col, {marginLeft: 3, marginRight: 3}]}>
          <View style={[{backgroundColor: DYNAMIC.text6, borderRadius: 16, height: 32}]}>
            <Text style={[common.tajawal3, {fontSize: 22, color: DYNAMIC.foreground, marginRight: 14, marginLeft:14, marginTop: 7}]}>{e}</Text>
          </View>
        </View>
      )
    })
  }


  render() {
    const { width, height } = Dimensions.get('window')
    const labelEl = (
      <Text style={{
        fontFamily: 'rubik-medium',
        fontSize:20,
        color: DYNAMIC.text7
      }}>
        Exercise Name
      </Text>
    )
    return (
      <View style={[common.staticView]}>
        <KeyboardAwareScrollView style={{flex:1, justifyContent: 'start'}}>
          <View style={[common.row, {marginTop: 10}]}>
            <Text style={[common.tajawal5, {fontSize: 22, color: DYNAMIC.text10, textAlign: 'center'}]}>
              {`Type the names of exercises \n in your workout.`}
            </Text>
          </View>
          <View style={common.row}>
            <Text style={[common.tajawal3, {fontSize: 18, color: DYNAMIC.text8}]}>Hit next when you’ve added them all.</Text>
          </View>
          <View style={[common.row, {height: 100}]}>
            <ScrollView horizontal={true} centerContent={true} ref={(element) => { this.pillContainer = element }}>
            { this.renderExercises() }
            </ScrollView>
          </View>
          <Input
            value={this.state.currentName}
            label={labelEl}
            onChangeText={this.changeExerciseNameHandler}
            ref={(element) => { this.input = element }}
            style={{width: width-20}}
            fixedLabel={true}
            fontSize={24}
            animate={false}
          />
          <View style={[common.row]}>
            <TouchableOpacity onPress={this.addExercise}>
              <MaterialIcons
                name={"add-circle"}
                size={32} color={DYNAMIC.link}
                style={{top: -62, left: width/2 - 26, backgroundColor: 'transparent'}}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}


export default connect(null, null)(ListExercisesScreen)
