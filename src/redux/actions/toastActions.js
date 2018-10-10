export function openToast(toast) {
  return {
    type: 'OPEN_TOAST',
    toastState: toast
  }
}

export function closeToast() {
  return {
    type: 'CLOSE_TOAST'
  }
}
