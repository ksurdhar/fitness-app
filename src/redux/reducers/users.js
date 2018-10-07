const initialState = {
  user: {}
}

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case 'RECIEVED_USER':
      return { user: Object.values(action.user)[0] }
    case 'ADD_USER_SUCCESS':
      return { user: Object.values(action.user)[0] }
    case 'UPDATE_USER_SUCCESS':
      return { user: Object.values(action.user)[0] } // might need to do something here
    default:
      return state
  }
}
