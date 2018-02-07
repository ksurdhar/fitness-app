import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { TabNavigator } from "react-navigation";

import WorkoutsScreen from "./components/WorkoutsScreen";
import HomeScreen from "./components/HomeScreen";

const Navigator = TabNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Workouts: {
      screen: WorkoutsScreen
    }
  },
  {
    tabBarPosition: "bottom",
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: "#e91e63"
    }
  }
);

export default Navigator;
