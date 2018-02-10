import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';

class ProfileScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ tintColor }) => (
      <Text>Profile</Text>
    ),
  };

  render() {
    let message = 'No user logged in.'
    if (this.props.isLoggedIn) {
      message = this.props.user.email
    }
    return (
      <View style={styles.container}>
        <Text>{message}</Text>
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  }
});

export default connect(mapStateToProps, null)(ProfileScreen);
