const initialState = {
  users: [],
}

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case 'RECIEVED_USERS':
      const updatedUsers = action.users ? Object.values(action.users) : []
      return Object.assign({}, state, {
        users: updatedUsers
      })
    case 'ADD_USER_SUCCESS':
      return Object.assign({}, state, {
        users: state.users.concat(action.user)
      })
    case 'REMOVE_USER_SUCCESS':
      return Object.assign({}, state, {
        users: state.users.filter((user) => user.id !== action.user.id)
      })
    default:
      return state
  }
}
