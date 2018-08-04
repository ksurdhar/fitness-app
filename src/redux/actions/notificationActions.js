import { rootRef } from '../../firebase';

export function recievedNotifications(notifications) {
  return {
    type: 'RECIEVED_NOTIFICATIONS',
    notifications: notifications
  }
}

// turns array into object where [apple, orange] -> {0: apple, 1: orange}
Array.prototype.toObj = function () {
  const obj = {}
  this.forEach((entry, idx) => {
    obj[idx] = entry
  })
  return obj
}

// simplify add notification
export function addNotification(workoutID, userID, hours, minutes, daysInterval) {
  const id = Math.random().toString(36).substring(7)
  const notificationRef = rootRef.child(`notifications/${workoutID}`)

  notificationRef.set({
    id,
    userID,
    hours,
    minutes,
    daysInterval
  })

  return {
    type: 'ADD_NOTIFICATION'
  }
}

export function removeNotification(workoutID) {
  const notificationRef = rootRef.child(`notifications/${workoutID}`)
  notificationRef.remove()

  return {
    type: 'REMOVE_NOTIFICATION'
  }
}

export function removeNotificationSuccess(notification) {
  return {
    type: 'REMOVE_NOTIFICATION_SUCCESS',
    notification: notification
  }
}

export function addNotificationSuccess(notification) {
  return {
    type: 'ADD_NOTIFICATION_SUCCESS',
    notification: notification
  };
}
