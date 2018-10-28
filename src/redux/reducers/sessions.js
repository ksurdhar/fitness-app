const initialState = {
  sessions: [],
  mostRecentSession: null,
  weeklyCount: 0
}

function determineWeeklyCount(sessions) {
  const lastMonday = new Date()
  lastMonday.setDate(lastMonday.getDate() - (lastMonday.getDay() + 6) % 7)
  lastMonday.setHours(0)

  let count = 0
  sessions.forEach((session) => {
    if (session.date > lastMonday.getTime()) {
      count = count + 1
    }
  })
  return count
}

function getMostRecentSession(sessions) {
  let mostRecentSession = null
  if (sessions.length > 0) {
    mostRecentSession = sessions[0]
    sessions.forEach((session) => {
      if (session.date > mostRecentSession.date) {
        mostRecentSession = session
      }
    })
  }
  return mostRecentSession
}

export default function sessionsReducer(state = initialState, action) {
  let updatedSessions
  switch (action.type) {
    case 'RECIEVED_SESSIONS':
      updatedSessions = action.sessions ? Object.values(action.sessions) : []
      return Object.assign({}, state, {
        sessions: updatedSessions,
        mostRecentSession: getMostRecentSession(updatedSessions),
        weeklyCount: determineWeeklyCount(updatedSessions)
      })
    case 'ADD_SESSION_SUCCESS':
      updatedSessions = state.sessions.concat(action.session)
      return Object.assign({}, state, {
        sessions: updatedSessions,
        mostRecentSession: getMostRecentSession(updatedSessions),
        weeklyCount: determineWeeklyCount(updatedSessions)
      })
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
      updatedSessions = state.sessions.filter((session) => session.id !== action.session.id)
      return Object.assign({}, state, {
        sessions: updatedSessions,
        mostRecentSession: getMostRecentSession(updatedSessions),
        weeklyCount: determineWeeklyCount(updatedSessions)
      })
    default:
      return state
  }
}
