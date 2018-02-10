import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as authActions from '../redux/actions/authActions.js';

class ProfileScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ tintColor }) => (
      <Text>Profile</Text>
    ),
  };

  logout() {
    this.props.logout();
  }

  render() {
    let message = 'No user logged in.'
    if (this.props.isLoggedIn) {
      message = this.props.user.email
    }
    return (
      <View style={styles.container}>
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
    marginTop: 20,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
