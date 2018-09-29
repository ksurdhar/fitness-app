import React from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal
} from 'react-native'
import { format } from 'date-fns'
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons'

import BasicCard from './reusable/basicCard'
import BasicButton from './reusable/basicButton'
import { common, DYNAMIC } from './reusable/common'
import * as workoutActions from '../redux/actions/workoutActions'
import * as sessionActions from '../redux/actions/sessionActions'

ATTR_ORDER = ['sets', 'reps', 'weight', 'time']

const mapStateToProps = (state, ownProps) => {
  return {
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

  constructor(props) {
    super(props)

    this.state = {
      sessionEditing: null, // the whole session object
      isEditing: false,
      isModalOpen: false
    }
  }

  componentDidUpdate() {
    // console.log('SESSION EDITING STATE', this.state.sessionEditing)
    // console.log('WORKOUTS PROPS', this.props)
  }

  // currently unused
  navigateToSession(item) {
    // console.log('navigating to session!')
    // this.props.navigation.navigate('Session', {
    //   session: item,
    //   userID: this.props.userID
    // })
  }

  removeSession = () => {
    const userID = this.props.userID
    this.props.removeSession(this.state.sessionEditing.id, userID)
    this.setState({
      sessionEditing: null,
      isModalOpen: false
    })
  }

  toggleEditing = () => {
    this.setState({
      isEditing: !this.state.isEditing
    })
  }

  renderModalOptionList() {
    return (
      <View>
        <View style={{
          height: 60,
          borderTopColor: DYNAMIC.text1, borderTopWidth: 1,
          justifyContent: 'center'
        }}>
          <BasicButton onPress={ this.toggleEditing }>
            <Text style={[ common.tajawal5, common.mdFont, {color: DYNAMIC.link, marginTop: 10}]}>
              Edit
            </Text>
          </BasicButton>
        </View>
        <View style={{
          height: 60,
          borderTopColor: DYNAMIC.text1, borderTopWidth: 1,
          justifyContent: 'center'
        }}>
          <BasicButton onPress={ this.removeSession }>
            <Text style={[ common.tajawal5, common.mdFont, {color: DYNAMIC.link, marginTop: 10}]}>
              Delete
            </Text>
          </BasicButton>
        </View>
      </View>
    )
  }

  maybeSessionRenderModal() {
    const { height, width } = Dimensions.get('window')
    const session = this.state.sessionEditing

    if (this.state.isModalOpen) {
      return (
        <Modal
          animationType="slide"
          transparent={true}>
          <TouchableWithoutFeedback onPress={() => { this.setState({ sessionEditing: null, isModalOpen: false }) }}>
            <View style={{
              backgroundColor: DYNAMIC.text,
              justifyContent: 'space-around',
              height,
              width
            }}>
              <TouchableWithoutFeedback onPress={(event) => { event.stopPropagation() }}>
                <View style={{
                  backgroundColor: DYNAMIC.foreground,
                  marginLeft: 20,
                  marginTop: 20,
                  marginRight: 20,
                  marginBottom: 20,
                  height: height - 80,
                  width: width - 40,
                  padding: 10
                }}>
                  <Text>{`${session.workoutName} session`}</Text>
                  <Text>{ format(session.date, 'MMM D') }</Text>
                  { this.renderModalOptionList() }
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )
    } else {
      return null
    }
  }

  render() {
    const { height } = Dimensions.get('window')
    const isEmpty = this.props.sessions.length === 0

    return (
      <View style={common.staticView, { paddingLeft: 10, paddingRight: 10, backgroundColor: DYNAMIC.foreground5, height: height }}>
        <ScrollView style={{paddingTop: 10, marginBottom: 110}}>
          { isEmpty? this.renderEmptyMessage() : this.renderSessionCards() }
          { this.maybeSessionRenderModal() }
        </ScrollView>
      </View>
    )
  }

  renderSessionCards = () => {
    return this.props.sessions.map((session) => {
      const dateString = format(session.date, 'dddd, MMM D [at] h:mm A')
      const headerString = format(session.date, 'MMM D')

      const cardHeader = (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
          <View style={{flexDirection: 'column'}}>
            <Text style={[common.tajawal3, {fontSize: 18, color: DYNAMIC.text8}]}>
              { dateString }
            </Text>
            <Text style={[common.tajawal5, {fontSize: 26, color: DYNAMIC.text10}]}>
              {session.workoutName}
            </Text>
          </View>
          <TouchableOpacity onPress={() => this.setState({ isModalOpen: true, sessionEditing: session }) }>
            <View style={{ marginRight: 10 }}>
              <Ionicons name='ios-more' size={36} color={DYNAMIC.text}/>
            </View>
          </TouchableOpacity>
        </View>
      )

      const cardBody = (
        <View>
          { this.renderExerciseTexts(session.exercises) }
          { this.maybeRenderNotes(session.noteText) }
        </View>
      )

      return (
        <BasicCard
          key={session.id}
          header={cardHeader}
          body={cardBody}
        />
      )
    })
  }

  maybeRenderNotes(text) {
    if (text.length > 0 ) {
      return (
        <Text style={[common.tajawal5, {fontSize: 20, color: DYNAMIC.text9, paddingBottom: 10}]}>
          { `Notes: \n` }
          <Text style={[common.tajawal3, {fontSize: 18, color: DYNAMIC.text8}]}>
            { text }
          </Text>
        </Text>
      )
    } else {
      return null
    }
  }

  renderExerciseTexts = (exercises) => {
    if (exercises) {
      return Object.values(exercises).map((exercise) => {
        exercise.attributes.sort((a, b) => ATTR_ORDER.indexOf(a.type) > ATTR_ORDER.indexOf(b.type))
        const strings = exercise.attributes.map((attr, idx) => {
          let formattedType = attr.type
          if (attr.type == 'weight') {
            formattedType = 'lbs' // TODO: add toggle between lbs / kg
          }
          if (attr.type == 'time') {
            formattedType = 'secs'
          }
          return `${attr.val} ${formattedType}`
        })
        const attrString = strings.join(' / ')
        return (
          <Text style={[common.tajawal5, {fontSize: 20, color: DYNAMIC.text9, paddingBottom: 10}]}>
            {exercise.name}
            <Text style={[common.tajawal3, {fontSize: 18, color: DYNAMIC.text8}]}>
              {`\n${attrString}`}
            </Text>
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
          <Text style={[{ fontFamily: 'rubik-medium', fontSize: 24, textAlign: 'center', color: DYNAMIC.text9 }]}>
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
