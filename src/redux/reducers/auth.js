const defaultState = {
  isLoggedIn: false,
  user: {}
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'LOGIN':
      return Object.assign({}, state, {
        isLoggedIn: true,
        user: action.user
      });
    case 'LOGOUT':
      return Object.assign({}, state, {
        isLoggedIn: false,
        user: {}
      });
    default:
      return state;
  }
}
