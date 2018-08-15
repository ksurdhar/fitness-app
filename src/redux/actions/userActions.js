import { rootRef } from '../../firebase'

export function addUser(user) {
  const userRef = rootRef.child(`users/${user.uid}`)

  userRef.set({
    userID: user.uid,
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
