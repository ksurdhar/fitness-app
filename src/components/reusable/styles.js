import {
  StyleSheet,
} from 'react-native'

COLORS = {
  white: 'ghostwhite',
  orange: 'rgb(223, 102, 89)',
  gray1: 'rgba(64, 77, 91, 0.1)',
  gray3: 'rgba(64, 77, 91, 0.3)',
  gray5: 'rgba(64, 77, 91, 0.5)',
  gray6: 'rgba(64, 77, 91, 0.6)',
  gray7: 'rgba(64, 77, 91, 0.7)',
  gray8: 'rgba(64, 77, 91, 0.8)',
  gray9: 'rgba(64, 77, 91, 0.9)',
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
  staticView: {
    backgroundColor: COLORS.white,
    flex: 1,
    padding: 10,
    justifyContent: "flex-start",
  },
  headerFont: {
    fontFamily: 'raleway-bold',
    fontSize: 42
  }
})

export {
  commonStyles,
  styleButton,
  COLORS,
}
