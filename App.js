import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TabNavigator } from 'react-navigation';

class MyHomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => (
      <Text>Home</Text>
    ),
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.props.navigation.navigate('Workouts')}
          title="Go to workouts"
        />
      </View>
    );
  }
}

class MyWorkoutsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Workouts',
    tabBarIcon: ({ tintColor }) => (
      <Text>Workouts</Text>
    ),
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Go back home"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const MyApp = TabNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Workouts: {
    screen: MyWorkoutsScreen,
  },
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});

export default MyApp
