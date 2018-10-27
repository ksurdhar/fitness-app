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

import AnimatedText from '../reusable/animatedText'
import Input from '../reusable/input'
import PressCapture from '../reusable/pressCapture'
import { common, DYNAMIC } from '../reusable/common'

class ListExercisesScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: `Add Exercises`,
      headerRight: (
        <View style={{paddingRight: 10}}>
          <TouchableOpacity onPress={navigation.getParam('toListAttributes')} disabled={!navigation.getParam('nextEnabled')}>
            <AnimatedText
              value={'Next'}
              textColors={[DYNAMIC.black3, DYNAMIC.link]}
              isEnabled={navigation.getParam('nextEnabled')}
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
      categories: ['Arms', 'Legs', 'Core', 'Chest', 'Back', 'Shoulders'],
      isCatalogOpen: false,
      activeCategory: '',
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
    this.props.navigation.setParams({
      nextEnabled: false,
      toListAttributes: this.toListAttributes
    })
    this.input && this.input.focus()
  }

  componentDidUpdate(prevProps, prevState) {
    // determines list of results
    if (prevState.textField !== this.state.textField) {
      const results = this.state.database.map((workout) => workout.name).filter((workout) => {
        // filter out exercises already added
        return workout.includes(this.state.textField) && !prevState.exerciseNames.includes(workout)
      }).sort()

      if (results.length === this.state.database.length || this.state.textField.length === 0) {
        // remove the dropdown of suggestions
        this.setState({ results: [] })
      } else {
        this.setState({
          results
        })
      }
    }

    // focus input
    if (prevState.isCatalogOpen && !this.state.isCatalogOpen) {
      this.input && this.input.focus()
    }

    // enable next button
    const exerciseLength = this.state.exerciseNames.length
    const prevExerciseLength = prevState.exerciseNames.length
    if (exerciseLength !== prevExerciseLength) {
      this.props.navigation.setParams({
        nextEnabled: exerciseLength > 0
      })
    }
  }

  handleCapture = () => {
    this.input && this.input.blur()
  }

  toListAttributes = () => {
    this.props.navigation.navigate('ListAttributes', {
      exerciseNames: this.state.exerciseNames
    })
  }

  changeExerciseNameHandler = (value) => {
    this.setState({textField: value})
  }

  addExercise = (exerciseName) => {
    this.setState({
      exerciseNames: this.state.exerciseNames.concat([exerciseName]),
      textField: ''
    })
  }

  toggleExerciseViaCatalog = (catalogExercise) => {
    if (this.state.exerciseNames.includes(catalogExercise)) {
      newExerciseNames = this.state.exerciseNames.filter((exercise) => {
        return exercise !== catalogExercise
      })
      this.setState({ exerciseNames: newExerciseNames })
    } else {
      this.setState({
        exerciseNames: this.state.exerciseNames.concat([catalogExercise])
      })
    }
  }

  render() {
    const { width, height } = Dimensions.get('window')

    const renderHeader = () => {
      const isCatalogOpen = this.state.isCatalogOpen
      return (
        <View>
          <View style={[common.row, { marginTop: 10 }]}>
            <TouchableOpacity onPress={() => this.setState({ isCatalogOpen: false}) }>
              <Text style={[common.tajawal3, {fontSize: 20, textAlign: 'center', color: isCatalogOpen ? DYNAMIC.primary : DYNAMIC.black, textDecorationLine: isCatalogOpen ? 'underline' : 'none' }]}>
                {`Use the input  `}
              </Text>
            </TouchableOpacity>
            <Text style={[common.tajawal3, {fontSize: 20, color: DYNAMIC.black, textAlign: 'center'}]}>
              or
            </Text>
            <TouchableOpacity onPress={() => this.setState({ isCatalogOpen: true }) }>
              <Text style={[common.tajawal3, {fontSize: 20, textAlign: 'center', color: isCatalogOpen ? DYNAMIC.black : DYNAMIC.primary, textDecorationLine: isCatalogOpen ? 'none' : 'underline'  }]}>
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
          <Text style={{fontSize: 18, fontFamily: 'rubik', color: DYNAMIC.black}}>{`${this.state.exerciseNames.length} exercises added`}</Text>
        </View>
      )
    }

    const maybeRenderAutoComplete = () => {
      const labelEl = (
        <Text style={{
          fontFamily: 'rubik',
          fontSize:20,
          color: DYNAMIC.black7
        }}>
          Exercise Name
        </Text>
      )

      if (!this.state.isCatalogOpen) {
        return (
          <View style={{ marginTop: 40 }}>
          <Autocomplete
            inputContainerStyle={styleInput()}
            listStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
            data={this.state.results}
            renderItem={item => (
              <TouchableOpacity onPress={() => this.addExercise(item) }>
                <Text style={{ fontSize: 24, fontFamily: 'rubik'}}>{item}</Text>
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

    const maybeRenderSuggestion = () => {
      const noResults = this.state.textField.length > 0 && this.state.results.length === 0
      const moreThanOneCharacter = this.state.textField.length > 1
      if (!this.state.isCatalogOpen && noResults && moreThanOneCharacter) {
        return (
          <View style={[common.col, { marginTop: 40 }]}>
            <Text style={[common.tajawal5, {fontSize: 18, color: DYNAMIC.black8 }]}>No results found.</Text>
            <TouchableOpacity onPress={() => this.addExercise(this.state.textField) }>
              <Text style={[common.tajawal3, {fontSize: 18, color: DYNAMIC.link, textDecorationLine: 'underline' }]}>Add custom exercise?</Text>
            </TouchableOpacity>
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
                  <Text style={{ fontSize: 24, fontFamily: 'rubik', marginBottom: 6, color: DYNAMIC.black8 }}>
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
                  fontFamily: 'rubik',
                  color: this.state.activeCategory === category ? DYNAMIC.link : DYNAMIC.black5,
                }}>
                  { category }
                </Text>
              </TouchableOpacity>
              { maybeRenderCategoryExercises(category) }
            </View>
          )
        })

        return (
          <ScrollView>
            <View style={{ marginTop: 24 }}>
              { buttons }
            </View>
          </ScrollView>
        )
      } else {
        return null
      }
    }

    return (
      <PressCapture onPress={this.handleCapture}>
        <View style={[common.staticView, {backgroundColor: DYNAMIC.white}] }>
          <View style={{flex:1, justifyContent: 'start'}}>
            <View>
              { renderHeader() }
              { renderExerciseCount() }
              { maybeRenderAutoComplete() }
              { maybeRenderCatalog() }
              { maybeRenderSuggestion() }
            </View>
          </View>
        </View>
      </PressCapture>
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
