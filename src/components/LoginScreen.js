import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button
} from "react-native";
import firebase from "firebase";
import { login, loginFailed } from "../redux/actions/authActions.js";
import { addWorkoutSuccess, removeWorkoutSuccess, recievedWorkouts } from '../redux/actions/workoutActions';
import config from '../../config.js';
import store from '../redux/store.js'
import { firebaseApp } from '../firebase.js'

const LOGIN = "Login";
const SIGNUP = "Sign Up";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: LOGIN,
      email: "",
      password: ""
    };

    if (config.DEV_MODE) {
      this.state.email = 'admin@gmail.com'
      this.state.password = 'password'
    }
  }

  onLogin(e) {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        // TODO: move this into something managing state, clean up connections on logout
        const personalizedRef = firebaseApp.database().ref(`workouts/${user.uid}`)
        personalizedRef.on('child_added', (snapshot) => {
          store.dispatch(addWorkoutSuccess(snapshot.val()))
        })

        personalizedRef.on('child_removed', (snapshot) => {
          store.dispatch(removeWorkoutSuccess(snapshot.val()))
        })

        personalizedRef.once('value', (snapshot) => {
          store.dispatch(recievedWorkouts(snapshot.val()))
        })
        this.props.dispatchLogin(user);
      })
      .catch(error => {
        console.log("login failed: " + error);
      });
  }

  onSignUp(e) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.props.dispatchLogin(user);
      })
      .catch(error => {
        console.log("signup failed: " + error);
      });
  }

  onSubmitForm(e) {
    e.preventDefault();

    switch (this.state.action) {
      case LOGIN:
        return this.onLogin(e);
      case SIGNUP:
        return this.onSignUp(e);
    }
  }

  onToggleAction(e) {
    e.preventDefault();

    this.setState({ action: this.state.action === LOGIN ? SIGNUP : LOGIN });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.state.action}</Text>
        <TextInput
          placeholder="Email Address"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          keyboardType="email-address"
          value={this.state.email}
          onChangeText={text => this.setState({ email: text })}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
        />
        <Button onPress={e => this.onSubmitForm(e)} title={this.state.action} />
        <Button
          onPress={e => this.onToggleAction(e)}
          title={this.state.action === LOGIN ? SIGNUP : LOGIN}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 48
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchLogin: user => {
      dispatch(login(user));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
