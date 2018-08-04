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
    case 'REMOVE_NOTIFICATION_SUCCESS':
      return Object.assign({}, state, {
        notifications: state.notifications.filter((notification) => notification.id !== action.notification.id)
      })
    default:
      return state
  }
}
