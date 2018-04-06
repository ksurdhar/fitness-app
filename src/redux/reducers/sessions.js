const initialState = {
  sessions: [],
};

export default function sessionsReducer(state = initialState, action) {
  switch (action.type) {
    case 'RECIEVED_SESSIONS':
      const updatedSessions = action.sessions ? Object.values(action.sessions) : []
      return Object.assign({}, state, {
        sessions: updatedSessions
      });
    case 'ADD_SESSION_SUCCESS':
      return Object.assign({}, state, {
        sessions: state.sessions.concat(action.session)
      });
    case 'REMOVE_SESSION_SUCCESS':
      return Object.assign({}, state, {
        sessions: state.sessions.filter((session) => session.id !== action.session.id)
      });
    default:
      return state;
  }
}
