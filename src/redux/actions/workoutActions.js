import { workoutsRef } from '../../firebase';

export function addWorkout(name) {
  const id = Math.random().toString(36).substring(7)
  const workoutRef = workoutsRef.child(id)

  workoutRef.set({
    id,
    name: name
  })

  return {
    type: 'ADD_WORKOUT'
  }
}

export function addWorkoutSuccess(workout) {
  return {
    type: 'ADD_WORKOUT_SUCCESS',
    workout: workout
  };
}

export function mockAction() {
  return {
    type: 'MOCK_ACTION'
  }
}
