import { workoutsRef } from '../../firebase';

export function recievedWorkouts(workouts) {
  return {
    type: 'RECIEVED_WORKOUTS',
    workouts: workouts
  }
}

export function addWorkout(workoutName, exerciseNames, userID) {
  const id = Math.random().toString(36).substring(7)
  const workoutRef = workoutsRef.child(`${userID}/${id}`)

  const exercises = {}
  exerciseNames.forEach((name) => {
    const exerciseID = Math.random().toString(36).substring(7)
    exercises[exerciseID] = {
      id: exerciseID,
      name: name
    }
  })

  workoutRef.set({
    id,
    name: workoutName,
    exercises,
  })

  return {
    type: 'ADD_WORKOUT'
  }
}

export function removeWorkout(id, userID) {
  const workoutRef = workoutsRef.child(`${userID}/${id}`)
  workoutRef.remove()

  return {
    type: 'REMOVE_WORKOUT'
  }
}

export function removeWorkoutSuccess(workout) {
  return {
    type: 'REMOVE_WORKOUT_SUCCESS',
    workout: workout
  }
}

export function addWorkoutSuccess(workout) {
  return {
    type: 'ADD_WORKOUT_SUCCESS',
    workout: workout
  };
}
