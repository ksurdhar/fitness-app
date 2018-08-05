import produce from 'immer'

const initialState = {
  notifications: [],
}

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case 'RECIEVED_NOTIFICATIONS':
      console.log('RECEIVED NOTIFICATIONS')
      const updatedNotifications = action.notifications ? Object.values(action.notifications) : []
      return Object.assign({}, state, {
        notifications: updatedNotifications
      })
    case 'ADD_NOTIFICATION_SUCCESS':
      console.log('added notification - state', state)
      return Object.assign({}, state, {
        notifications: state.notifications.concat(action.notification)
      })
    case 'REMOVE_NOTIFICATION_SUCCESS':
      console.log('ID on action to delete', action.notification.id)
      console.log('state', state)
      // find the index of the notification
      const index = state.notifications.findIndex((notification) => {
        return notification.id === action.notification.id
      })
      console.log('index', index)

      const foo = produce(state, (draftState) => {
        draftState.notifications.splice(index, 1)
      })
      console.log('new notification state', foo)
      return foo
    default:
      return state
  }
}
