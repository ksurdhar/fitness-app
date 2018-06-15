import React from 'react'
import { connect } from 'react-redux'
import produce from 'immer'
import {
  Keyboard,
  Picker,
  ScrollView,
  Dimensions,
  Animated,
  Button,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback
} from 'react-native'
import SideSwipe from 'react-native-sideswipe'

import KButton from './reusable/button'
import Input from './reusable/input'
import Switch from './reusable/switch'
import PressCapture from './reusable/pressCapture'
import { common, COLORS } from './reusable/styles'
import * as workoutActions from '../redux/actions/workoutActions'

ATTRIBUTE_TYPES = [
  'sets',
  'reps',
  'weight',
  'seconds',
]

// exerciseData = {} of exerciseNames -> attributes[]
ADD_WORKOUT_STATE = {
  carouselIdx: 0,
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
    this.state = ADD_WORKOUT_STATE
  }

  resetState() {
    this.setState(ADD_WORKOUT_STATE)
  }

  componentDidMount() {
    // const params = this.props.navigation.state.params
    // this.setState({
    //   workoutID: params.workoutID,
    //   workoutName: params.workoutName,
    //   exerciseData: params.exerciseData,
    //   exerciseNames: params.exerciseNames,
    // })
  }

  componentDidUpdate() {
    console.log('state',this.state)
  }

  // addWorkout() {
  //   this.props.addWorkout(
  //     this.state.workoutName,
  //     this.state.exerciseNames,
  //     this.state.exerciseData,
  //     this.props.user.uid
  //   )
  //   this.resetState()
  //   this.props.navigation.navigate('Workouts')
  //   Keyboard.dismiss()
  // }
  //
  // addExercise() {
  //   let newEIdx = 0 // default when no exercises exist
  //   if (Object.keys(this.state.exerciseData).length > 0) {
  //     newEIdx = Object.keys(this.state.exerciseData).length
  //   }
    // this.setState((prevState) => {
    //   return produce(prevState, (draftState) => {
    //     draftState.exerciseNames.push('')
    //     draftState.exerciseData[newEIdx] = {0: {type: null, val: null}}
    //   })
    // })
  // }
  //
  // handleInputChange(idx, value) {
  //   let exerciseNames = [...this.state.exerciseNames]
  //   exerciseNames[idx] = value
  //   this.setState({ exerciseNames })
  // }
  //
  // toggleAttr(eIdx, aIdx, attrType) {
  //   this.setState((prevState) => {
  //     return produce(prevState, (draftState) => {
  //       const attr = prevState.exerciseData[eIdx][aIdx]
  //       if (attr && !!attr.type) {
  //         delete draftState.exerciseData[eIdx][aIdx]
  //       } else {
  //         draftState.exerciseData[eIdx][aIdx] = {type: attrType, val: null}
  //       }
  //     })
  //   })
  // }
  //
  // renderAttrButtons(eIdx) {
  //   const buttons = ATTRIBUTE_TYPES.map((attr, aIdx) => {
  //     const style = {marginLeft: 2, marginRight: 2}
  //     const attrData = this.state.exerciseData[eIdx][aIdx]
  //     const attrEnabled = attrData && !!attrData.type
  //     if (attrEnabled) {
  //       style.borderWidth = 1
  //       style.borderColor = 'transparent'
  //     }
  //     return (
  //       <Button small rounded info
  //         bordered={ !attrEnabled }
  //         style={style}
  //         key={aIdx}
  //         onPress={this.toggleAttr.bind(this, eIdx, aIdx, attr) }>
  //         <Text>{attr}</Text>
  //       </Button>
  //     )
  //   })
  //
  //   return (
  //     <Container style={{flexDirection: 'row', paddingLeft: 12}}>
  //       { buttons }
  //     </Container>
  //   )
  // }
  //
  // renderExercises() {
  //   return this.state.exerciseNames.map((val, idx) => {
  //     return (
  //       <Container key={idx} style={{height: 100, paddingTop: 5, paddingBottom: 5}}>
  //         <Item floatingLabel style={{marginBottom: 10}}>
  //           <Label>{`exercise ${idx + 1}`}</Label>
  //           <Input
  //             key={idx}
  //             value={val || ''}
  //             onChangeText={ this.handleInputChange.bind(this, idx) }
  //           />
  //         </Item>
  //         { this.renderAttrButtons(idx) }
  //       </Container>
  //     )
  //   })
  // }

  // render() {
  //   const exerciseButton = (
  //     <Button rounded style={{marginRight: 4}} onPress={() => this.addExercise() }>
  //       <Text>Add Exercise</Text>
  //     </Button>
  //   )
  //   const createButton = (
  //     <Button rounded success onPress={() => this.addWorkout() }>
  //       <Text>Create Workout</Text>
  //     </Button>
  //   )
  //   return (
  //     <Container style={{flex: 1}}>
  //       <Content style={{flex: 1}} contentContainerStyle={styles.container}>
  //         { this.renderExercises() }
  //         <Container style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, height: 80}}>
  //           { exerciseButton }
  //           { createButton }
  //         </Container>
  //       </Content>
  //     </Container>
  //   )
  // }
  changeWorkoutNameHandler = (value) => {
    this.setState({workoutName: value})
  }

  changeExerciseNameHandler= (value) => {
    this.setState({exerciseName: value})
  }

  handleCapture = () => {
    this.textInput && this.textInput.blur()
  }

  isButtonEnabled = (direction) => {
    const spaceLeft = this.state.carouselIdx - 1 >= 0
    const spaceRight = this.state.carouselIdx + 1 < DATA.length
    const withinBoundary = direction === 'next' ? spaceRight : spaceLeft
    let indexCondition
    if (this.state.carouselIdx === 0) {
      indexCondition = true
    }
    if (this.state.carouselIdx === 1) {
      indexCondition = this.state.workoutName && this.state.workoutName.length > 0
    }
    if (this.state.carouselIdx === 2) {
      indexCondition = this.state.exerciseName && this.state.exerciseName.length

    }
    return direction === 'next' ? indexCondition && withinBoundary : withinBoundary
  }

  incrementCarousel = () => {
    if (this.state.carouselIdx + 1 < DATA.length) {
      this.setState({
        carouselIdx: this.state.carouselIdx + 1
      })
    }
  }

  decrementCarousel = () => {
    if (this.state.carouselIdx - 1 >= 0) {
      this.setState({
        carouselIdx: this.state.carouselIdx - 1
      })
    }
  }

  renderCurrentPrompt = (idx, item) => {
    switch (idx) {
      case 0:
        return (
          <View>
            <Switch label={'sets'}/>
            <Switch label={'reps'}/>
            <Switch label={'weight'}/>
            <Switch label={'seconds'}/>
          </View>
        )
      case 1:
        return (
          <Input
            value={this.state.workoutName}
            labelText='Name Your Workout:'
            onChangeText={this.changeWorkoutNameHandler}
            ref={(element) => { this.input1 = element }}
            small={true}
            fixedLabel={true}
            style={{marginBottom: 20}}
          />
        )
        break;
      case 2:
        return (
          <Input
            value={this.state.exerciseName}
            labelText='Name An Exercise:'
            onChangeText={this.changeExerciseNameHandler}
            ref={(element) => { this.input2 = element }}
            small={true}
            fixedLabel={true}
            style={{marginBottom: 20}}
          />
        )
        break;
    }
  }

  renderCarousel = () => {
    const { width } = Dimensions.get('window');

    return (
      <SideSwipe
        index={this.state.carouselIdx}
        itemWidth={width}
        style={{ width: width }}
        data={DATA}
        useNativeDriver={true}
        onIndexChange={index => {
          this.setState(() => ({ carouselIdx: index }))
        }}
        renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
          <View style={[{ width: width - 20, marginRight: 20, height: 140}]}>
            { this.renderCurrentPrompt(itemIndex, item) }
          </View>
        )}
      />
    )
  }

  render() {
    return (
      <View style={[common.staticView, {marginTop: 70}]}>
        <View style={{
          height: 180,
          borderBottomWidth: 2,
          borderTopWidth: 2,
          borderTopColor: COLORS.gray1,
          borderBottomColor: COLORS.gray1,
          marginTop: 150,
          marginBottom: 20,
          paddingTop: 20
        }}>
          { this.renderCarousel() }
        </View>
        <View style={[common.row, {justifyContent: 'space-around'}]}>
          <KButton
            style={{width: 100, padding: 4}}
            value={'<'}
            isEnabled={this.isButtonEnabled('back')}
            onPress={ () => this.decrementCarousel() }
          />
          <KButton
            style={{width: 100, padding: 4}}
            value={'>'}
            isEnabled={this.isButtonEnabled('next')}
            onPress={ () => this.incrementCarousel() }
          />
        </View>
      </View>
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
