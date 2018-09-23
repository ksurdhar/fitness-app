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
import Autocomplete from 'react-native-autocomplete-input'

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
      textField: '',
      exerciseNames: ['pushups', 'pullups'],
      results: [],
      database: [
      'Bicep Curls',
      'Dips',
      'Push-Ups',
      'Lunges',
      'Squats', 'Kettlebell Swings', 'Leg Curls', 'Leg Press', 'Deadlifts', 'Step-ups', 'Crunches', 'Flutter Kicks', 'Leg Raises', 'Plank', 'Sit-ups', 'V-ups', 'Climbers', 'Bench Press', 'Burpees',
      'Cable Crosses', 'Chin-ups', 'Lat Pull Downs', 'Pull-Ups', 'Rows', 'Deadlifts',
      'Snaches',
      'Shrugs',
      'Shoulder Press',
      'Power Cleans',
      'Handstands'
      ]
    }
  }

  resetState() {
    this.setState({
      exerciseNames: []
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({ toListAttributes: this.toListAttributes })
    this.input.focus()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.textField !== this.state.textField) {
      const results = this.state.database.filter((workout) => {
        return workout.includes(this.state.textField)
      }).sort()

      if (results.length === this.state.database.length) {
        // remove the dropdown of suggestions
        this.setState({ results: [] })
      } else {
        this.setState({
          results
        })
      }
    }
  }

  toListAttributes = () => {
    this.props.navigation.navigate('ListAttributes', {
      exerciseNames: this.state.exerciseNames
    })
  }

  changeExerciseNameHandler = (value) => {
    this.setState({textField: value})
  }

  handleCapture = () => {
    this.textInput && this.textInput.blur()
  }

  addExercise = () => {
    this.setState({
      exerciseNames: this.state.exerciseNames.concat([this.state.textField]),
      textField: ''
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

    // <View style={[common.row, {height: 100}]}>
    //   <ScrollView horizontal={true} centerContent={true} ref={(element) => { this.pillContainer = element }}>
    //   { this.renderExercises() }
    //   </ScrollView>
    // </View>


    const renderHeader = () => {
      return (
        <View>
          <View style={[common.row, {marginTop: 10}]}>
            <Text style={[common.tajawal5, {fontSize: 22, color: DYNAMIC.text10, textAlign: 'center'}]}>
              {`Add exercises to your workout`}
            </Text>
          </View>
          <View style={common.row}>
            <Text style={[common.tajawal3, {fontSize: 16, color: DYNAMIC.text9}]}>{`Type in the input or select from the categories below`}</Text>
          </View>
        </View>
      )
    }

    const renderAutoComplete = () => {
      return (
        <View style={{ marginTop: 40 }}>
          <Autocomplete
            inputContainerStyle={styleInput()}
            listStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
            data={this.state.results}
            renderItem={item => (
              <TouchableOpacity onPress={() => { console.log('item', item)}}>
                <Text style={{ fontSize: 24, fontFamily: 'rubik-medium'}}>{item}</Text>
              </TouchableOpacity>
            )}
            renderTextInput={something => (
              <Input
                ref={(element) => { this.input = element }}
                value={this.state.textField}
                onChangeText={text => this.setState({ textField: text }) }
                style={{ width: width-20 }}
                fontSize={30}
                animate={true}
                noValidation={true}
              />
            )}
          />
        </View>
      )
    }

    return (
      <View style={[common.staticView]}>
        <KeyboardAwareScrollView style={{flex:1, justifyContent: 'start'}}>
          <View>
            { renderHeader() }
            { renderAutoComplete() }
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

function styleInput() {
  return {
    backgroundColor: 'transparent',
    borderWidth: 0,
  }
}


export default connect(null, null)(ListExercisesScreen)
