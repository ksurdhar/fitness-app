import React from "react"
import { StyleSheet, Text, View, Button } from "react-native"
import { createBottomTabNavigator, createStackNavigator } from "react-navigation"
import { SimpleLineIcons } from '@expo/vector-icons'

import { DYNAMIC } from './components/reusable/common'
import PromptScreen from "./components/PromptScreen"
import WorkoutsScreen from "./components/WorkoutsScreen"
import SessionScreen from "./components/SessionScreen"
import ProfileScreen from "./components/ProfileScreen"
import AddSessionScreen from './components/AddSessionScreen'
import ListExercisesScreen from './components/addWorkout/ListExercisesScreen'
import ListAttributesScreen from './components/addWorkout/ListAttributesScreen'
import NameWorkoutScreen from './components/addWorkout/NameWorkoutScreen'
import NotificationsScreen from './components/NotificationsScreen'
import UpdateSessionScreen from './components/UpdateSessionScreen'

const commonTabOptions = {
  activeTintColor: DYNAMIC.link,
  inactiveTintColor: DYNAMIC.white,
  style: {
    backgroundColor: DYNAMIC.primary,
  },
}

const commonNavOptions = {
  headerStyle: {
    backgroundColor: DYNAMIC.primary
  },
  headerTintColor: DYNAMIC.white,
  headerTitleStyle: {
    fontFamily: 'rubik',
  },
  headerBackTitleStyle: {
    fontFamily: 'rubik',
  },
}

const WorkoutStack = createStackNavigator({
  Workouts: {
    screen: WorkoutsScreen
  },
  Session: {
    screen: SessionScreen
  },
  UpdateSession: {
    screen: UpdateSessionScreen
  }
}, {
  navigationOptions: commonNavOptions
})

const RecordStack = createStackNavigator({
  Record: {
    screen: PromptScreen
  },
  AddSession: {
    screen: AddSessionScreen
  },
  ListExercises: ListExercisesScreen,
  ListAttributes: ListAttributesScreen,
  NameWorkout: NameWorkoutScreen
}, {
  navigationOptions: commonNavOptions
})

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen
  },
  Notifications: {
    screen: NotificationsScreen
  }
}, {
  navigationOptions: commonNavOptions
})

const Navigator = createBottomTabNavigator( // https://reactnavigation.org/docs/en/bottom-tab-navigator.html
  {
    Workouts: {
      screen: WorkoutStack,
      navigationOptions: {
        tabBarLabel: 'Workouts',
        tabBarIcon: ({ tintColor }) => {
          return <SimpleLineIcons name={"notebook"} size={24} color={tintColor}/>
        },
      }
    },
    Record: {
      screen: RecordStack,
      navigationOptions: {
        tabBarLabel: 'Record',
        tabBarIcon: ({ tintColor }) => (
          <SimpleLineIcons name={"pencil"} size={24} color={tintColor}/>
        ),
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <SimpleLineIcons name={"user"} size={24} color={tintColor}/>
        ),
      }
    }
  },
  {
    animationEnabled: true,
    tabBarOptions: commonTabOptions,
    initialRouteName: 'Profile',
  }
)

export default Navigator
