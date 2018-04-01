import { rootRef } from '../../firebase';

export function recievedWorkouts(workouts) {
  return {
    type: 'RECIEVED_WORKOUTS',
    workouts: workouts
  }
}

export function addWorkout(workoutName, exerciseNames, exerciseData, userID) {
  const id = Math.random().toString(36).substring(7)
  const workoutRef = rootRef.ref('workouts').child(`${id}`)

  const exercises = {}
  exerciseNames.forEach((name, eIdx) => {
    const exerciseID = Math.random().toString(36).substring(7)
    const attributes = {}
    Object.entries(exerciseData[eIdx]).forEach((exercise, attrIdx) => {
      attributes[attrIdx] = exercise[1] // {type, val}
    })

    exercises[exerciseID] = {
      id: exerciseID,
      name: name,
      attributes: attributes
    }
  })

  workoutRef.set({
    id,
    userID,
    name: workoutName,
    exercises,
  })

  return {
    type: 'ADD_WORKOUT'
  }
}

export function removeWorkout(id, userID) {
  const workoutRef = rootRef.child(`${userID}/workouts/${id}`)
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
