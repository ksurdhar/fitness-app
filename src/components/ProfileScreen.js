import React from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { StyleSheet, Text, View, Button } from 'react-native'
import { Entypo, Feather } from '@expo/vector-icons'

import * as authActions from '../redux/actions/authActions.js'
import { firebaseApp } from '../firebase.js'

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile'
  }

  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        firebaseApp.database().ref(`workouts/${this.props.user.uid}`).off()
        this.props.logout()
        console.log('logged out!')
      })
  }

  toNotifications = () => {
    console.log('notifications!')
    this.props.navigation.navigate('Notifications')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.user.email}</Text>
        <Button
          title='Notifications'
          onPress={() => this.toNotifications()}
        />
        <Button
          title='Logout'
          onPress={() => this.logout()}
        />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (name) => { dispatch(authActions.logout()) },
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
