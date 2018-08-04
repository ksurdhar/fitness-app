import { rootRef } from '../../firebase';

export function recievedUsers(users) {
  return {
    type: 'RECIEVED_USERS',
    users: users
  }
}

export function addUser(userObj) {
  const userRef = rootRef.child(`users/${userObj.id}`)

  userRef.set({
    userID: userObj.id,
    name: userObj.name
  })

  return {
    type: 'ADD_USER'
  }
}

// add an update user method here
// export function addUser(userObj) {
//   const userRef = rootRef.child(`users/${userObj.id}`)
//
//   userRef.set({
//     userID: userObj.id,
//     name: userObj.name
//   })
//
//   return {
//     type: 'ADD_USER'
//   }
// }

export function removeUser(workoutID) {
  const userRef = rootRef.child(`users/${workoutID}`)
  userRef.remove()

  return {
    type: 'REMOVE_USER'
  }
}

export function removeUserSuccess(user) {
  return {
    type: 'REMOVE_USER_SUCCESS',
    user: user
  }
}

export function addUserSuccess(user) {
  return {
    type: 'ADD_USER_SUCCESS',
    user: user
  };
}
