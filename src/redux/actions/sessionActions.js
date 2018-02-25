import { usersRef } from '../../firebase';

export function recievedSessions(sessions) {
  return {
    type: 'RECIEVED_SESSIONS',
    sessions: sessions
  }
}

export function addSession(sessionName, exerciseNames, exerciseData, userID) {
  const id = Math.random().toString(36).substring(7)
  const sessionRef = usersRef.child(`${userID}/sessions/${id}`)

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

  sessionRef.set({
    id,
    name: sessionName,
    exercises,
  })

  return {
    type: 'ADD_SESSION'
  }
}

export function removeSession(id, userID) {
  const sessionRef = usersRef.child(`${userID}/sessions/${id}`)
  sessionRef.remove()

  return {
    type: 'REMOVE_SESSION'
  }
}

export function removeSessionSuccess(session) {
  return {
    type: 'REMOVE_SESSION_SUCCESS',
    session: session
  }
}

export function addSessionSuccess(session) {
  return {
    type: 'ADD_SESSION_SUCCESS',
    session: session
  };
}
