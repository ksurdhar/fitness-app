const initialState = {
  toastString: '',
  type: null // success, error
}

export default function toastsReducer(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_TOAST':
      return action.toastState
    case 'CLOSE_TOAST':
      return {
        toastString: '',
        isOpen: false,
        type: null
      }
    default:
      return state
  }
}
