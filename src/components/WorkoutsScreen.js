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

import ExpandingCard from './reusable/expandingCard'
import { common, COLORS } from './reusable/common'
import * as workoutActions from '../redux/actions/workoutActions'
import * as sessionActions from '../redux/actions/sessionActions'

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
    if (exercises) {
      return Object.values(exercises).map((exercise) => {
        let attrString = ''
        exercise.attributes.forEach((attr) => {
          attrString = attrString + `${attr.val} ${attr.type} / `
        })
        return (
          <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8, paddingBottom: 2}]}>
          {`${exercise.name} - ${attrString}`}
          </Text>
        )
      })
    } else {
      return null
    }
  }

  removeSession = (id) => {
    const userID = this.props.userID
    this.props.removeSession(id, userID)
  }

  renderEmptyMessage = () => {
    const { height } = Dimensions.get('window')
    return (
      <View style={{ justifyContent: 'center', height: height/2 }}>
        <View style={common.row}>
          <Text style={[{ fontFamily: 'rubik-medium', fontSize: 24, textAlign: 'center', color: COLORS.gray9 }]}>
            {'You have not recorded a workout. Try recording one!'}
          </Text>
        </View>
      </View>
    )
  }

  renderSessionCards = () => {
    return this.props.sessions.map((session) => {
      const dateString = format(session.date, 'dddd, MMM D [at] h:mm A')
      return (
        <ExpandingCard
          key={session.id}
          subHeader={dateString}
          header={session.workoutName}
          deleteHandler={this.removeSession.bind(this, session.id)}
        >
          { this.renderExerciseTexts(session.exercises) }
        </ExpandingCard>
      )
    })
  }

  render() {
    const { height } = Dimensions.get('window')
    const isEmpty = this.props.sessions.length === 0

    return (
      <View style={common.staticView, { marginLeft: 10, marginRight: 10, backgroundColor: COLORS.white }}>
        <View style={[common.row,  { marginTop: 20, marginBottom: 5, justifyContent: 'space-between' }]}>
          <Text style={[common.baseFont, common.lgFont, {marginLeft: 5, color: COLORS.gray10}]}>
            Workouts
          </Text>
        </View>
        <ScrollView style={{paddingTop: 10, marginBottom: 70, height: height - 240}}>
          { isEmpty? this.renderEmptyMessage() : this.renderSessionCards() }
        </ScrollView>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeSession: (id, userID) => { dispatch(sessionActions.removeSession(id, userID)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutsScreen)
