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
import * as sessionActions from '../redux/actions/sessionActions'
import { Dropdown } from 'react-native-material-dropdown'
import { Button, Text, Container, Content, Input, Form, Item } from 'native-base'

INITIAL_STATE = {
  workoutName: '',
  exerciseNames: [],
  exerciseData: {},
}

// SHAPE OF EXERCISE DATA
// Object {
//   "0": Object {
//     "0": Object {
//       "type": "sets",
//       "val": null,
//     },
//     "1": Object {
//       "type": "reps",
//       "val": null,
//     },
//   },
// }

ATTRIBUTE_TYPES = [
  'sets',
  'reps',
  'weight',
  'seconds',
]

ATTRIBUTE_VALS = [...Array(100).keys()].map((num) => {
  return {value: num + 1}
})

class AddSessionScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params } = navigation.state

    return {
      title: `Recording ${params.workoutName}`,
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

  addSession() {
    this.props.addSession(
      this.state.exerciseNames,
      this.state.exerciseData,
      this.props.user.uid,
      this.state.workoutID,
      this.state.workoutName
    )
    this.resetState()
    this.props.navigation.navigate('Workouts')
    Keyboard.dismiss()
  }

  setAttrVal(exIdx, attrIdx, val) {
    this.setState((prevState) => {
      return produce(prevState, (draftState) => {
        draftState.exerciseData[exIdx][attrIdx].val = val
      })
    })
  }

  renderValDropdown(exIdx, attrIdx) {
    return (
      <Container style={{ width: 96, Left: 8}}>
        <Dropdown
          label='Val'
          data={ATTRIBUTE_VALS}
          onChangeText={ this.setAttrVal.bind(this, exIdx, attrIdx) }
        />
      </Container>
    )
  }

  renderAttrInputs(exIdx) {
    return Object.entries(this.state.exerciseData[exIdx]).map(([attrIdx, attr]) => {
      return (
        <Container key={attrIdx} style={{height: 100, paddingTop: 5, paddingBottom: 5}}>
          <Text>{attr.type}</Text>
          <Item>
            <Input underline keyboardType={"numeric"} onChangeText={ this.setAttrVal.bind(this, exIdx, attrIdx)}></Input>
          </Item>
        </Container>
      )
    })
  }

  renderExercises() {
    return this.state.exerciseNames.map((val, exIdx) => {
      return (
        <Container key={exIdx} style={{height: 100, paddingTop: 5, paddingBottom: 5}}>
          <Text>{val}</Text>
          <Form>
            { this.renderAttrInputs(exIdx) }
          </Form>
        </Container>
      )
    })
  }

  render() {
    const recordButton = (
      <Button rounded success onPress={() => this.addSession() }>
        <Text>{ 'Record Session' }</Text>
      </Button>
    )
    return (
      <Container style={{flex: 1}}>
        <Content style={{flex: 1}} contentContainerStyle={styles.container}>
          { this.renderExercises() }
          <Container style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, height: 80}}>
            { recordButton }
          </Container>
        </Content>
      </Container>
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
    addSession: (exerciseNames, exerciseData, uid, workoutID, workoutName) => { dispatch(sessionActions.addSession(exerciseNames, exerciseData, uid, workoutID, workoutName)) },
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 42,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 20,
    width: 320,
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AddSessionScreen)
