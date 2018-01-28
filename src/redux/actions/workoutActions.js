export function addWorkout(workout) {
  return {
    type: 'ADD_WORKOUT',
    workout: workout
  };
}

export function mockAction() {
  return {
    type: 'MOCK_ACTION'
  }
}
