import React from "react"
import { StyleSheet, Text, View, Button } from "react-native"
import { TabNavigator, StackNavigator } from "react-navigation"

import PromptScreen from "./components/PromptScreen"
import WorkoutsScreen from "./components/WorkoutsScreen"
import WorkoutScreen from "./components/WorkoutScreen"
import ProfileScreen from "./components/ProfileScreen"
import NameWorkoutScreen from './components/NameWorkoutScreen'
import AddWorkoutScreen from './components/AddWorkoutScreen'
import AddSessionScreen from './components/AddSessionScreen'


const WorkoutStack = StackNavigator({
  Workouts: {
    screen: WorkoutsScreen
  },
  Workout: {
    screen: WorkoutScreen
  }
})

const RecordStack = StackNavigator({
  Record: {
    screen: PromptScreen
  },
  NameWorkout: {
    screen: NameWorkoutScreen
  },
  AddWorkout: {
    screen: AddWorkoutScreen
  },
  AddSession: {
    screen: AddSessionScreen
  }
})

const Navigator = TabNavigator(
  {
    Workouts: {
      screen: WorkoutStack
    },
    Record: {
      screen: RecordStack
    },
    Profile: {
      screen: ProfileScreen
    }
  },
  {
    tabBarPosition: "bottom",
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: "#e91e63"
    }
  }
)

export default Navigator
