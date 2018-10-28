const initialState = {
  user: {}
}

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case 'RECIEVED_USER':
      return { user: action.user }
    case 'ADD_USER_SUCCESS':
      return { user: action.user }
    case 'UPDATE_USER_SUCCESS':
      return { user: action.user }
    default:
      return state
  }
}
