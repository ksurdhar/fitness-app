import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import {
  StyleSheet,
  TextInput,
  Keyboard,
  View,
  Picker,
} from 'react-native'
import * as workoutActions from '../redux/actions/workoutActions'
import { Dropdown } from 'react-native-material-dropdown'
import { Button, Text, Container, Content, Input, Item, Label } from 'native-base'

ATTRIBUTE_TYPES = [
  'sets',
  'reps',
  'weight',
  'seconds',
]

INITIAL_STATE = {
  workoutName: '',
  exerciseNames: [],
  exerciseData: {},
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
}

class AddWorkoutScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state

    return {
      title: `Defining ${params.workoutName}`,
      tabBarLabel: 'Record',
      tabBarIcon: ({ tintColor }) => (
        <Text>Record</Text>
      )
    }
  }

  constructor() {
    super()
    this.state = INITIAL_STATE
  }

  resetState() {
    this.setState(INITIAL_STATE)
  }

  componentDidMount() {
    const params = this.props.navigation.state.params
    this.setState({
      workoutID: params.workoutID,
      workoutName: params.workoutName,
      exerciseData: params.exerciseData,
      exerciseNames: params.exerciseNames,
    })
  }

  componentDidUpdate() {
    console.log('state',this.state)
  }

  addWorkout() {
    this.props.addWorkout(
      this.state.workoutName,
      this.state.exerciseNames,
      this.state.exerciseData,
      this.props.user.uid
    )
    this.resetState()
    this.props.navigation.navigate('Workouts')
    Keyboard.dismiss()
  }

  addExercise() {
    let newEIdx = 0 // default when no exercises exist
    if (Object.keys(this.state.exerciseData).length > 0) {
      newEIdx = Object.keys(this.state.exerciseData).length
    }
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseNames.push('')
        draftState.exerciseData[newEIdx] = {0: {type: null, val: null}}
      })
    })
  }

  handleInputChange(idx, value) {
    let exerciseNames = [...this.state.exerciseNames]
    exerciseNames[idx] = value
    this.setState({ exerciseNames })
  }

  toggleAttr(eIdx, aIdx, attrType) {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        const attr = prevState.exerciseData[eIdx][aIdx]
        if (attr && !!attr.type) {
          delete draftState.exerciseData[eIdx][aIdx]
        } else {
          draftState.exerciseData[eIdx][aIdx] = {type: attrType, val: null}
        }
      })
    })
  }

  renderAttrButtons(eIdx) {
    const buttons = ATTRIBUTE_TYPES.map((attr, aIdx) => {
      const style = {marginLeft: 2, marginRight: 2}
      const attrData = this.state.exerciseData[eIdx][aIdx]
      const attrEnabled = attrData && !!attrData.type
      if (attrEnabled) {
        style.borderWidth = 1
        style.borderColor = 'transparent'
      }
      return (
        <Button small rounded info
          bordered={ !attrEnabled }
          style={style}
          key={aIdx}
          onPress={this.toggleAttr.bind(this, eIdx, aIdx, attr) }>
          <Text>{attr}</Text>
        </Button>
      )
    })

    return (
      <Container style={{flexDirection: 'row', paddingLeft: 12}}>
        { buttons }
      </Container>
    )
  }

  renderExercises() {
    return this.state.exerciseNames.map((val, idx) => {
      return (
        <Container key={idx} style={{height: 100, paddingTop: 5, paddingBottom: 5}}>
          <Item floatingLabel style={{marginBottom: 10}}>
            <Label>{`exercise ${idx + 1}`}</Label>
            <Input
              key={idx}
              value={val || ''}
              onChangeText={ this.handleInputChange.bind(this, idx) }
            />
          </Item>
          { this.renderAttrButtons(idx) }
        </Container>
      )
    })
  }

  render() {
    const exerciseButton = (
      <Button rounded style={{marginRight: 4}} onPress={() => this.addExercise() }>
        <Text>Add Exercise</Text>
      </Button>
    )
    const createButton = (
      <Button rounded success onPress={() => this.addWorkout() }>
        <Text>Create Workout</Text>
      </Button>
    )
    return (
      <Container style={{flex: 1}}>
        <Content style={{flex: 1}} contentContainerStyle={styles.container}>
          { this.renderExercises() }
          <Container style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, height: 80}}>
            { exerciseButton }
            { createButton }
          </Container>
        </Content>
      </Container>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addWorkout: (workoutName, exerciseNames, exerciseData, uid) => {
      dispatch(workoutActions.addWorkout(workoutName, exerciseNames, exerciseData, uid))
    },
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddWorkoutScreen)
