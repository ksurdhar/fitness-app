import {
  StyleSheet,
} from 'react-native'

COLORS = {
  white: 'ghostwhite',
  orange: 'rgb(223, 102, 89)',
  gray1: 'rgba(64, 77, 91, 0.1)',
  gray3: 'rgba(64, 77, 91, 0.3)',
  gray5: 'rgba(64, 77, 91, 0.5)',
  gray10: 'rgba(64, 77, 91, 1.0)'
}

function styleButton(borderColors) {
  return {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopColor: borderColors.top,
    borderBottomColor: borderColors.bottom,
    borderLeftColor: borderColors.left,
    borderRightColor: borderColors.right,
    padding: 10,
    alignSelf: 'flex-start' // critical to create view width of contents
  }
}

const commonStyles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "flex-start",
  },
  staticView: {
    backgroundColor: COLORS.white,
    flex: 1,
    padding: 10
  }
})

export {
  commonStyles,
  styleButton,
  COLORS
}
