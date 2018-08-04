import React from "react"
import { StyleSheet, Text, View, Button } from "react-native"
import { createBottomTabNavigator, createStackNavigator } from "react-navigation"
import { SimpleLineIcons } from '@expo/vector-icons'

import PromptScreen from "./components/PromptScreen"
import WorkoutsScreen from "./components/WorkoutsScreen"
import WorkoutScreen from "./components/WorkoutScreen"
import ProfileScreen from "./components/ProfileScreen"
import AddWorkoutScreen from './components/AddWorkoutScreen'
import AddSessionScreen from './components/AddSessionScreen'
import ListExercisesScreen from './components/addWorkout/ListExercisesScreen'
import ListAttributesScreen from './components/addWorkout/ListAttributesScreen'
import NameWorkoutScreen from './components/addWorkout/NameWorkoutScreen'
import NotificationsScreen from './components/NotificationsScreen'

const WorkoutStack = createStackNavigator({
  Workouts: {
    screen: WorkoutsScreen
  },
  Workout: {
    screen: WorkoutScreen
  }
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
})

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen
  },
  Notifications: {
    screen: NotificationsScreen
  }
})

const Navigator = createBottomTabNavigator(
  {
    Workouts: {
      screen: WorkoutStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <SimpleLineIcons name={"notebook"} size={24}/>
        )
      }
    },
    Record: {
      screen: RecordStack,
      navigationOptions: {
        tabBarLabel: 'Record',
        tabBarIcon: ({ tintColor }) => (
          <SimpleLineIcons name={"pencil"} size={24}/>
        )
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <SimpleLineIcons name={"user"} size={24}/>
        ),
      }
    }
  },
  {
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: "#e91e63"
    }
  }
)

export default Navigator
