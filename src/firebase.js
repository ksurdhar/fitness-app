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

export const rootRef = firebaseApp.database()
