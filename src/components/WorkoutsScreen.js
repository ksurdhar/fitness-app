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
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons'

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
      <Feather name={"trash"} size={28}/>
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

  removeSession = (id) => {
    const userID = this.props.userID
    this.props.removeSession(id, userID)
  }

  render() {
    const { height } = Dimensions.get('window')
    const isEmpty = this.props.sessions.length === 0

    return (
      <View style={common.staticView, { paddingLeft: 10, paddingRight: 10, backgroundColor: COLORS.white, height: height }}>
        <ScrollView style={{paddingTop: 10, marginBottom: 110}}>
          { isEmpty? this.renderEmptyMessage() : this.renderSessionCards() }
        </ScrollView>
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
          swipeable={true}
          expandable={true}
        >
          { this.renderExerciseTexts(session.exercises) }
          { this.renderNotes(session.noteText) }
        </ExpandingCard>
      )
    })
  }

  renderNotes(text) {
    if (text.length > 0 ) {
      return (
        <Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8, paddingBottom: 2}]}>
        { `Notes: \n` + text }
        </Text>
      )
    } else {
      return null
    }
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

  renderEmptyMessage = () => {
    const { height } = Dimensions.get('window')
    return (
      <View style={{ justifyContent: 'center', top: (height/2 - 130) }}>
        <View style={common.row}>
          <Text style={[{ fontFamily: 'rubik-medium', fontSize: 24, textAlign: 'center', color: COLORS.gray9 }]}>
            {'You have not recorded a workout. Try recording one!'}
          </Text>
        </View>
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
