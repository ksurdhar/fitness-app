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

  // used
  peach: '253, 114, 114',
  navy: '24, 44, 97',
  white: '248, 248, 255',
  summerSky: '52, 172, 224',
  fluorescentRed: '255, 82, 82',
  celestialGreen: '51, 217, 178',
  gray: '64, 77, 91',
}

const TYPES = {
  text: 'gray',
  foreground: 'white',
  background: 'navy',
  link: 'summerSky',
  red: 'fluorescentRed',
  green: 'celestialGreen'
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
console.log('dynamic', DYNAMIC)

const common = StyleSheet.create({
  staticView: {
    backgroundColor: DYNAMIC.foreground,
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
  DYNAMIC
}
