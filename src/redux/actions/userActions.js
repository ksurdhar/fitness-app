import { rootRef } from '../../firebase'

export function addUser(user) {
  // email sign up will return with a uid
  // gmail sign up will return an id
  const userID = user.uid ? user.uid : user.id
  const userRef = rootRef.child(`users/${userID}`)

  userRef.set({
    userID: userID,
    email: user.email,
  })

  return {
    type: 'ADD_USER'
  }
}

export function updateUser(id, patchObj) {
  const userRef = rootRef.child(`users/${id}`)
  userRef.update(patchObj)

  return {
    type: 'UPDATE_USER'
  }
}

export function addUserSuccess(user) {
  return {
    type: 'ADD_USER_SUCCESS',
    user: user
  }
}

export function updateUserSuccess(user) {
  return {
    type: 'UPDATE_USER_SUCCESS',
    user: user
  }
}

export function recievedUser(user) {
  return {
    type: 'RECIEVED_USER',
    user: user
  }
}
