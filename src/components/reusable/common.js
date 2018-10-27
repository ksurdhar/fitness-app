import {
  StyleSheet,
} from 'react-native'
// https://flatuicolors.com/palette/in
// https://digitalsynopsis.com/design/minimal-web-color-palettes-combination-hex-code/

const COLORS = {
  // unused
  orange: '223, 102, 89',
  fuchsia: '179, 55, 113',
  chill: '27, 156, 252',
  spiro: '37, 204, 247',
  sarawak: '248, 239, 186',

  // test palatte
  yaleBlue: '24, 68, 145',
  almond: '237, 228, 203',
  minionYellow: '247, 211, 84',

  prussianBlue: '0, 52, 89',
  richBlack: '0, 23, 31',
  white: '255, 255, 255',
  unitedNationsBlue: '94, 124, 226', // hex code #5e7ce2

  // used
  peach: '253, 114, 114',
  navy: '24, 44, 97',
  ghostWhite: '248, 248, 255',
  summerSky: '52, 172, 224',
  fluorescentRed: '255, 82, 82',
  celestialGreen: '51, 217, 178',
  gray: '64, 77, 91',
}

const TYPES = {
  primary: 'unitedNationsBlue',
  secondary: 'minionYellow',
  text: 'unitedNationsBlue',
  black: 'gray',
  white: 'white',
  link: 'minionYellow',    // interactable color
  red: 'fluorescentRed',   // error color
  green: 'celestialGreen', // success color
}

const DYNAMIC = {}
Object.entries(TYPES).forEach(([type, color]) => {
  for (var i = 0; i <= 10; i++) {
    const val = i == 10 ? `rgba(${COLORS[color]}, 1.0)` : `rgba(${COLORS[color]}, 0.${i})`
    DYNAMIC[type+i] = val
    if (i == 0) {
      DYNAMIC[type] = `rgba(${COLORS[color]}, 1.0)` // add the full color entry
    }
  }
})

console.log('DYNAMIC', DYNAMIC)

const common = StyleSheet.create({
  staticView: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
  },
  headerFont: {
    fontFamily: 'raleway-bold',
    fontSize: 42
  },
  baseFont: {
    fontFamily: 'rubik',
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
  roboto: {
    fontFamily: 'roboto-medium'
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
  DYNAMIC
}
