import {
  StyleSheet,
} from 'react-native'
// https://flatuicolors.com/palette/in
COLORS = {
  white: 'ghostwhite',
  orange: 'rgb(223, 102, 89)',
  peach: 'rgba(253, 114, 114,1.0)',
  fuchsia: 'rgba(179, 55, 113,1.0)',
  chill: 'rgba(27, 156, 252,1.0)',
  spiro: 'rgba(37, 204, 247,1.0)',
  navy: 'rgba(24, 44, 97,1.0)',
  sarawak: 'rgba(248, 239, 186,1.0)',
  gray0: 'rgba(64, 77, 91, 0.0)',
  gray1: 'rgba(64, 77, 91, 0.1)',
  gray2: 'rgba(64, 77, 91, 0.2)',
  gray3: 'rgba(64, 77, 91, 0.3)',
  gray5: 'rgba(64, 77, 91, 0.5)',
  gray6: 'rgba(64, 77, 91, 0.6)',
  gray7: 'rgba(64, 77, 91, 0.7)',
  gray8: 'rgba(64, 77, 91, 0.8)',
  gray9: 'rgba(64, 77, 91, 0.9)',
  gray10: 'rgba(64, 77, 91, 1.0)'
}

const common = StyleSheet.create({
  staticView: {
    backgroundColor: COLORS.white,
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
  },
  headerFont: {
    fontFamily: 'raleway-bold',
    fontSize: 42
  },
  baseFont: {
    fontFamily: 'rubik-medium',
    fontSize: 24
  },
  smFont: {
    fontSize: 18
  },
  mdFont: {
    fontSize: 24
  },
  lgFont: {
    fontSize: 36
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
})

export {
  common,
  COLORS,
}
