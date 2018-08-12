import produce from 'immer'

const initialState = {
  notifications: [],
}

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case 'RECIEVED_NOTIFICATIONS':
      const updatedNotifications = action.notifications ? Object.values(action.notifications) : []
      return Object.assign({}, state, {
        notifications: updatedNotifications
      })
    case 'ADD_NOTIFICATION_SUCCESS':
      return Object.assign({}, state, {
        notifications: state.notifications.concat(action.notification)
      })
    case 'UPDATE_NOTIFICATION_SUCCESS':
      const newNotifications = []
      state.notifications.forEach((notification) => {
        if (notification.id !== action.notification.id) {
          newNotifications.push(notification)
        } else {
          newNotifications.push(action.notification)
        }
      })
      return Object.assign({}, state, {
        notifications: newNotifications
      })
    case 'REMOVE_NOTIFICATION_SUCCESS':
      const index = state.notifications.findIndex((notification) => {
        return notification.id === action.notification.id
      })

      const foo = produce(state, (draftState) => {
        draftState.notifications.splice(index, 1)
      })
      return foo
    default:
      return state
  }
}
