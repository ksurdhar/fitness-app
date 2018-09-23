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
import { FontAwesome } from '@expo/vector-icons'
import Autocomplete from 'react-native-autocomplete-input'

import Input from '../reusable/input'
import PressCapture from '../reusable/pressCapture'
import { common, DYNAMIC } from '../reusable/common'

class ListExercisesScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `Add Exercises`,
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
      categories: ['Arms', 'Legs', 'Core', 'Chest', 'Back', 'Shoulders'],
      isCatalogOpen: true,
      activeCategory: 'Arms',
      textField: '',
      exerciseNames: [],
      results: [],
      database: [
        {name: 'Bicep Curls', categories: ['Arms']},
        {name: 'Dips', categories: ['Arms', 'Chest']},
        {name: 'Push-Ups', categories: ['Arms', 'Chest']},
        {name: 'Lunges', categories: ['Legs']},
        {name: 'Squats', categories: ['Legs']},
        {name: 'Kettlebell Swings', categories: ['Legs', 'Core']},
        {name: 'Leg Curls', categories: ['Legs']},
        {name: 'Leg Press', categories: ['Legs']},
        {name: 'Deadlifts', categories: ['Legs', 'Back']},
        {name: 'Step-ups', categories: ['Legs']},
        {name: 'Crunches', categories: ['Core']},
        {name: 'Flutter Kicks', categories: ['Core']},
        {name: 'Leg Raises', categories: ['Core']},
        {name: 'Plank', categories: ['Core']},
        {name: 'Sit-ups', categories: ['Core']},
        {name: 'V-ups', categories: ['Core']},
        {name: 'Climbers', categories: ['Core']},
        {name: 'Bench Press', categories: ['Chest', 'Arms']},
        {name: 'Burpees', categories: ['Arms', 'Legs', 'Core']},
        {name: 'Cable Crosses', categories: ['Chest']},
        {name: 'Chin-ups', categories: ['Back', 'Arms']},
        {name: 'Lat Pull Downs', categories: ['Back']},
        {name: 'Pull-Ups', categories: ['Back', 'Arms']},
        {name: 'Rows', categories: ['Core']},
        {name: 'Snaches', categories: ['Shoulders']},
        {name: 'Shrugs', categories: ['Shoulders']},
        {name: 'Shoulder Press', categories: ['Shoulders']},
        {name: 'Power Cleans', categories: ['Shoulders']},
        {name: 'Handstands', categories: ['Shoulders']}
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
    this.input && this.input.focus()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.textField !== this.state.textField) {
      const results = this.state.database.map((workout) => workout.name).filter((workout) => {
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
    console.log(this.state.exerciseNames)
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

  toggleExerciseViaCatalog = (catalogExercise) => {
    let newExerciseNames = this.state.exerciseNames
    if (this.state.exerciseNames.includes(catalogExercise)) {
      newExerciseNames = newExerciseNames.filter((exercise) => {
        return exercise !== catalogExercise
      })
    } else {
      newExerciseNames.push(catalogExercise)
    }
    this.setState({ exerciseNames: newExerciseNames })
  }

  render() {
    const { width, height } = Dimensions.get('window')
    const labelEl = (
      <Text style={{
        fontFamily: 'rubik-medium',
        fontSize:20,
        color: DYNAMIC.text7
      }}>
        Exercise
      </Text>
    )

    const renderHeader = () => {
      const isCatalogOpen = this.state.isCatalogOpen
      return (
        <View>
          <View style={[common.row, { marginTop: 10 }]}>
              <TouchableOpacity onPress={() => this.setState({ isCatalogOpen: false}) }>
                <Text style={[common.tajawal3, {fontSize: 20, textAlign: 'center', color: isCatalogOpen ? DYNAMIC.link : DYNAMIC.text, textDecorationLine: isCatalogOpen ? 'underline' : 'none' }]}>
                  {`Use the input  `}
                </Text>
              </TouchableOpacity>
              <Text style={[common.tajawal3, {fontSize: 20, color: DYNAMIC.text, textAlign: 'center'}]}>
                or
              </Text>
              <TouchableOpacity onPress={() => this.setState({ isCatalogOpen: true }) }>
                <Text style={[common.tajawal3, {fontSize: 20, textAlign: 'center', color: isCatalogOpen ? DYNAMIC.text : DYNAMIC.link, textDecorationLine: isCatalogOpen ? 'none' : 'underline'  }]}>
                  {` select from a category.`}
                </Text>
              </TouchableOpacity>
          </View>
        </View>
      )
    }

    const renderExerciseCount = () => {
      return (
        <View style={[common.row,  {marginTop: 20}]}>
          <Text style={{fontSize: 18, fontFamily: 'rubik-medium', color: DYNAMIC.text}}>{`${this.state.exerciseNames.length} exercises added`}</Text>
        </View>
      )
    }

    const maybeRenderAutoComplete = () => {
      if (!this.state.isCatalogOpen) {
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
            label={labelEl}
            fixedLabel={true}
            animate={true}
            noValidation={true}
            />
          )}
          />
          </View>
        )
      } else {
        return null
      }
    }

    const maybeRenderCheck = (exerciseName) => {
      if (this.state.exerciseNames.includes(exerciseName)){
        return (
          <View style={{paddingLeft: 10, paddingTop: 2}}>
          <FontAwesome name={'check'} color={DYNAMIC.green} size={24}/>
          </View>
        )
      } else {
        return null
      }
    }

    const maybeRenderCategoryExercises = (category) => {
      if (this.state.activeCategory === category) {
        const exerciseEls = this.state.database.map((exercise) => {
          // display exercises which match category
          if (exercise.categories.includes(this.state.activeCategory)) {
            return (
              <TouchableOpacity onPress={ this.toggleExerciseViaCatalog.bind(this, exercise.name) }>
                <View style={{flexDirection: 'row', justifyContent: 'left'}}>
                  <Text style={{ fontSize: 24, fontFamily: 'rubik-medium', marginBottom: 6, color: DYNAMIC.text8 }}>
                    { exercise.name }
                  </Text>
                  { maybeRenderCheck(exercise.name) }
                </View>
              </TouchableOpacity>
            )
          }
        })
        return (
          <View style={{ marginLeft: 16 }}>
            { exerciseEls }
          </View>
        )
      } else {
        return null
      }
    }

    const maybeRenderCatalog = () => {
      if (this.state.isCatalogOpen) {
        const buttons = this.state.categories.map((category) => {
          return (
            <View style={{marginLeft: 5, marginBottom: 4}}>
              <TouchableOpacity onPress={() => this.setState({ activeCategory: this.state.activeCategory === category ? '' : category }) }>
                <Text style={{
                  fontSize: 30,
                  fontFamily: 'rubik-medium',
                  color: this.state.activeCategory === category ? DYNAMIC.link : DYNAMIC.text5,
                }}>
                  { category }
                </Text>
              </TouchableOpacity>
              { maybeRenderCategoryExercises(category) }
            </View>
          )
        })

        return (
          <View style={{ marginTop: 24 }}>
            { buttons }
          </View>
        )
      } else {
        return null
      }
    }

    return (
      <View style={[common.staticView]}>
        <KeyboardAwareScrollView style={{flex:1, justifyContent: 'start'}}>
          <View>
            { renderHeader() }
            { renderExerciseCount() }
            { maybeRenderAutoComplete() }
            { maybeRenderCatalog() }
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
