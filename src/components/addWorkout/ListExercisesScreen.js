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
  ScrollView
} from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { MaterialIcons } from '@expo/vector-icons'

import KButton from '../reusable/button'
import Input from '../reusable/input'
import PressCapture from '../reusable/pressCapture'
import { common, COLORS } from '../reusable/common'

class ListExercisesScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `List Exercises`,
    }
  }

  constructor() {
    super()
    this.state = {
      currentName: '',
      exerciseNames: []
    }
  }

  resetState() {
    this.setState({
      exerciseNames: []
    })
  }

  componentDidUpdate() {
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

// modify this to render pills which appear width wise
  renderExercises = () => {
    return this.state.exerciseNames.map((e) => {
      return (
        <View style={[common.col, {marginLeft: 3, marginRight: 3}]}>
          <View style={[{backgroundColor: COLORS.gray6, borderRadius: 16, height: 32}]}>
            <Text style={[common.tajawal3, {fontSize: 22, color: COLORS.white, marginRight: 14, marginLeft:14, marginTop: 7}]}>{e}</Text>
          </View>
        </View>
      )
    })
  }


  render() {
    const { width, height } = Dimensions.get('window')
    return (
      <View style={[common.staticView]}>
        <KeyboardAwareScrollView style={{flex:1, justifyContent: 'start'}}>
          <View style={common.row}>
            <Text style={[common.tajawal5, {fontSize: 22, color: COLORS.gray10, textAlign: 'center'}]}>
              {`Type the names of exercises \n in your workout.`}
            </Text>
          </View>
          <View style={common.row}>
            <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>Hit next when you’ve added them all.</Text>
          </View>
          <View style={[common.row, {height: 100}]}>
            <ScrollView horizontal={true} centerContent={true} onContentSizeChange={(e) => {console.log('CONTENT SIZE CHANGE', e)}} ref={(element) => { this.pillContainer = element }}>
            { this.renderExercises() }
            </ScrollView>
          </View>
          <Input
            value={this.state.currentName}
            labelText='Exercise Name'
            onChangeText={this.changeExerciseNameHandler}
            ref={(element) => { this.input = element }}
            small={true}
            style={{marginBottom: 20, width: width-20}}
            fixedLabel={true}
          />
          <View style={[common.row]}>
            <MaterialIcons name={"add-circle"} size={32} color={COLORS.peach} style={{top: -62, left: 180, backgroundColor: 'transparent'}} onPress={this.addExercise}/>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}


export default connect(null, null)(ListExercisesScreen)
