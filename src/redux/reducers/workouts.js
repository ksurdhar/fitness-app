const initialState = {
  workouts: [],
};

export default function workoutsReducer(state = initialState, action) {
  switch (action.type) {
    case 'RECIEVED_WORKOUTS':
      const updatedWorkouts = action.workouts ? Object.values(action.workouts) : []
      return Object.assign({}, state, {
        workouts: updatedWorkouts
      });
    case 'ADD_WORKOUT_SUCCESS':
      return Object.assign({}, state, {
        workouts: state.workouts.concat(action.workout)
      });
    case 'REMOVE_WORKOUT_SUCCESS':
      return Object.assign({}, state, {
        workouts: state.workouts.filter((workout) => workout.id !== action.workout.id)
      });
    default:
      return state;
  }
}
