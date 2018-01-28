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
    case 'MOCK_ACTION':
      const newMessage = state.message === 'redux connected' ? 'action working' : 'redux connected';
      return Object.assign({}, state, {
        message: newMessage
      });
    default:
      return state;
  }
}
