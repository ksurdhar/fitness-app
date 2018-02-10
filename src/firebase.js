import { initializeApp } from 'firebase'
import {
  addWorkoutSuccess,
  removeWorkoutSuccess,
  recievedWorkouts
} from './redux/actions/workoutActions';

import config from '../config'

export const firebaseApp = initializeApp({
  apiKey: config.API_KEY,
  authDomain: config.AUTH_DOMAIN,
  databaseURL: config.DATABASE_URL,
  storageBucket: config.STORAGE_BUCKET
})

export const workoutsRef = firebaseApp.database().ref('workouts')

export function syncFirebase(store) {
  // workoutsRef.on('child_added', (snapshot) => {
  //   store.dispatch(addWorkoutSuccess(snapshot.val()))
  // })
  //
  // workoutsRef.on('child_removed', (snapshot) => {
  //   store.dispatch(removeWorkoutSuccess(snapshot.val()))
  // })
  //
  // workoutsRef.once('value', (snapshot) => {
  //   store.dispatch(recievedWorkouts(snapshot.val()))
  // })
}
