const initialState = {
  sessions: [],
}

// initialState.sessions.push(
//   {
//     date: new Date(),
//     exercises: [
//       {
//         name: 'Push Ups',
//         attributes: [
//           { type: 'sets', val: 4 },
//           { type: 'reps', val: 8 },
//           { type: 'weight', val: 25 },
//           { type: 'time', val: 60 },
//         ]
//       },
//       {
//         name: 'Pull Ups',
//         attributes: [
//           { type: 'sets', val: 4 },
//           { type: 'reps', val: 8 },
//         ]
//       },
//       {
//         name: 'Plank',
//         attributes: [
//           { type: 'sets', val: 2 },
//           { type: 'time', val: 60 },
//         ]
//       }
//     ],
//     workoutName: 'Leg Blaster',
//     noteText: 'Felt kind of weak, post long run.'
//   }
// )

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
    case 'UPDATE_SESSION_SUCCESS':
      const newSessions = []
      state.sessions.forEach((session) => {
        if (session.id !== action.session.id) {
          newSessions.push(session)
        } else {
          newSessions.push(action.session)
        }
      })
      return Object.assign({}, state, {
        sessions: newSessions
      })
    case 'REMOVE_SESSION_SUCCESS':
      return Object.assign({}, state, {
        sessions: state.sessions.filter((session) => session.id !== action.session.id)
      });
    default:
      return state;
  }
}
