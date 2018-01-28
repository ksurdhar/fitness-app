const initialState = {
  workouts: [],
  message: 'redux connected'
};

export default function workoutsReducer (state = initialState, action) {
  switch (action.type) {
    case 'ADD_WORKOUT':
      return Object.assign({}, state, {
        workouts: state.workouts.concat(action.workout)
      });
    default:
      return state;
  }
}
