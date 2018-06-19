import React from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  View,
  Text,
} from 'react-native'
import { format } from 'date-fns'

import { common, COLORS } from './reusable/styles'
import * as workoutActions from '../redux/actions/workoutActions'

const mapStateToProps = (state, ownProps) => {
  return {
    workouts: state.workouts.workouts,
    sessions: state.sessions.sessions,
    userID: state.auth.user.uid,
  }
}

class WorkoutsScreen extends React.Component {
  static navigationOptions = {
    title: 'Workouts',
    tabBarLabel: 'Workouts',
    tabBarIcon: ({ tintColor }) => (
      <Text>Workouts</Text>
    ),
  }

  componentDidUpdate() {
    // console.log('WORKOUTS STATE', this.state)
    // console.log('WORKOUTS PROPS', this.props)
  }

  navigateToSession(item) {
    this.props.navigation.navigate('Workout', {
      session: item,
      userID: this.props.userID
    })
  }

  renderExerciseTexts = (exercises) => {
    return Object.values(exercises).map((exercise) => {
      let attrString = ''
      exercise.attributes.forEach((attr) => {
        attrString = attrString + `${attr.val} ${attr.type} / `
      })
      return (
        <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>
        {`${exercise.name} - ${attrString}`}
        </Text>
      )
    })
  }

  renderSessionCards = () => {
    const { width } = Dimensions.get('window')

    const cards = this.props.sessions.map((session) => {
      const date = new Date()
      return (
        <View style={{
          width: width - 30,
          minHeight: 180,
          backgroundColor: COLORS.white,
          marginBottom: 16,
          marginLeft: 6,
          shadowColor: COLORS.gray10,
          shadowOpacity: 0.3,
          shadowOffset: { width: 1, height: 1 },
          shadowRadius: 2,
          paddingTop: 8,
          paddingBottom: 8,
        }}>
          <View style={{borderBottomColor: COLORS.gray1, borderBottomWidth: 1, marginBottom: 10, top: 64, zIndex: 2}} />
          <View style={{
            paddingLeft: 16,
            paddingRight: 16,
          }}>
            <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>{format(session.date, 'dddd, MMM D [at] h:mm A')}</Text>
            <Text style={[common.tajawal5, {fontSize: 26, color: COLORS.gray10, paddingBottom: 10}]}>{session.workoutName}</Text>
            { this.renderExerciseTexts(session.exercises) }
          </View>
        </View>
      )
    })

    return cards
  }

  render() {
    return (
      <View style={common.staticView, { marginLeft: 10, marginRight: 10, backgroundColor: COLORS.white }}>
        <View style={[common.row,  { marginTop: 20, marginBottom: 5, justifyContent: 'space-between' }]}>
          <Text style={[common.baseFont, common.lgFont, {marginLeft: 5, color: COLORS.gray10}]}>
            Workouts
          </Text>
        </View>
        <ScrollView style={{paddingTop: 10}}>
          { this.renderSessionCards() }
        </ScrollView>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeWorkout: (id, userID) => { dispatch(workoutActions.removeWorkout(id, userID)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutsScreen)
