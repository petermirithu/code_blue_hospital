import { extendTheme } from "native-base";

export const DefaultTheme = extendTheme({
  colors: {
    primary: {
      50: '#e7f2ff',
      100: '#c5d5ee',
      200: '#a2b9de',
      300: '#7e9dcd',
      400: '#5b81be',
      500: '#4168a4',
      600: '#325181',
      700: '#213a5d',
      800: '#11233b',
      900: '#000d1a',
    }
  },
  components: {
    Button: {
      baseStyle: {
        textAlign: "center",
        borderRadius: "32px",
        fontWeight: "500",
        borderColor: "primary.500",
        fontFamily: 'Poppins',
        height: 8,
      },
      defaultProps: {
        paddingLeft: 2,
        paddingRight: 2,
      }
    },
    Text: {
      baseStyle: {
        fontFamily: 'Poppins',
        fontWeight: "500",
        fontSize: 15,
      },
    }
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: 'light',
  },
})