import { rootRef } from '../../firebase';

export function recievedWorkouts(workouts) {
  return {
    type: 'RECIEVED_WORKOUTS',
    workouts: workouts
  }
}

// turns array into object where [apple, orange] -> {0: apple, 1: orange}
Array.prototype.toObj = function () {
  const obj = {}
  this.forEach((entry, idx) => {
    obj[idx] = entry
  })
  return obj
}

export function addWorkout(workoutName, exerciseData, userID) {
  const id = Math.random().toString(36).substring(7)
  const workoutRef = rootRef.child(`workouts/${id}`)

  const exercises = {}
  const ePairs = Object.entries(exerciseData)
  ePairs.forEach((pair, eIdx) => {
    const data = pair[1]
    const exerciseID = Math.random().toString(36).substring(7)
    const attrs = data.attributes.map((attr) => { return {type: attr} })

    exercises[exerciseID] = {
      id: exerciseID,
      name: data.name,
      attributes: attrs.toObj()
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
  const workoutRef = rootRef.child(`workouts/${id}`)
  workoutRef.remove()

  return {
    type: 'REMOVE_WORKOUT'
  }
}


export function updateWorkout(id, patchObj) {
  const workoutRef = rootRef.child(`workouts/${id}`)

  workoutRef.update(patchObj)

  return {
    type: 'UPDATE_NOTIFICATION' // uh - probably want to update this?
  }
}

export function updateWorkoutSuccess(workout) {
  return {
    type: 'UPDATE_WORKOUT_SUCCESS',
    workout: workout
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
