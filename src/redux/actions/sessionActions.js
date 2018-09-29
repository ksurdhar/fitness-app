import { rootRef } from '../../firebase';

export function recievedSessions(sessions) {
  return {
    type: 'RECIEVED_SESSIONS',
    sessions: sessions
  }
}

export function addSession(exerciseNames, exerciseData, userID, workoutID, workoutName, noteText) {
  const id = Math.random().toString(36).substring(7)
  const sessionRef = rootRef.child(`sessions/${id}`)
  const date = Date.now()

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
    exercises,
    userID,
    workoutID,
    date,
    workoutName,
    noteText
  })

  return {
    type: 'ADD_SESSION'
  }
}

export function updateSession(id, patchObj) {
  const sessionRef = rootRef.child(`sessions/${id}`)

  sessionRef.update(patchObj)

  return {
    type: 'UPDATE_SESSION'
  }
}

export function removeSession(id, userID) {
  const sessionRef = rootRef.child(`sessions/${id}`)
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
