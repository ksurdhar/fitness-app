import {
  StyleSheet,
} from 'react-native'
// https://flatuicolors.com/palette/in
// https://digitalsynopsis.com/design/minimal-web-color-palettes-combination-hex-code/
COLORS = {
  white: 'ghostwhite',
  orange: 'rgb(223, 102, 89)',
  peach: 'rgba(253, 114, 114, 1.0)',
  fuchsia: 'rgba(179, 55, 113,1.0)',
  chill5: 'rgba(27, 156, 252, 0.5)',
  chill7: 'rgba(27, 156, 252, 0.7)',
  chill8: 'rgba(27, 156, 252, 0.8)',
  chill9: 'rgba(27, 156, 252, 0.9)',
  chill: 'rgba(27, 156, 252, 1.0)',
  spiro: 'rgba(37, 204, 247, 1.0)',
  navy: 'rgba(24, 44, 97, 1.0)',
  sarawak: 'rgba(248, 239, 186, 1.0)',
  summerSky0: 'rgba(52, 172, 224, 0.0)',
  summerSky: 'rgba(52, 172, 224, 1.0)',
  fluorescentRed0: 'rgba(255, 82, 82, 0.0)',
  fluorescentRed: 'rgba(255, 82, 82, 1.0)',
  celestialGreen0: 'rgba(51, 217, 178, 0.0)',
  celestialGreen5: 'rgba(51, 217, 178, 0.5)',
  celestialGreen7: 'rgba(51, 217, 178, 0.7)',
  celestialGreen: 'rgba(51, 217, 178, 1.0)',
  gray0: 'rgba(64, 77, 91, 0.0)',
  gray1: 'rgba(64, 77, 91, 0.1)',
  gray2: 'rgba(64, 77, 91, 0.2)',
  gray3: 'rgba(64, 77, 91, 0.3)',
  gray4: 'rgba(64, 77, 91, 0.4)',
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
  },
  col: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  tajawal3: {
    fontFamily: 'tajawal3',
  },
  tajawal5: {
    fontFamily: 'tajawal5',
  },
  borders: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'black',
    borderRightColor: 'black',
    borderBottomColor: 'black',
    borderLeftColor: 'black',
  },
  whiteBorders: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'black',
    borderRightColor: 'black',
    borderBottomColor: 'black',
    borderLeftColor: 'black',
  }
})

export {
  common,
  COLORS,
}
