import React from 'react';
import firebase from "firebase";
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as authActions from '../redux/actions/authActions.js';
import { firebaseApp } from '../firebase.js'

class ProfileScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ tintColor }) => (
      <Text>Profile</Text>
    ),
  };

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

  render() {
    let message = 'No user logged in.'
    if (this.props.isLoggedIn) {
      message = this.props.user.email
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text>{message}</Text>
        <Button
          title='Logout'
          onPress={() => this.logout()}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (name) => { dispatch(authActions.logout()); },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 40,
    marginTop: 60,
    marginBottom: 60,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
