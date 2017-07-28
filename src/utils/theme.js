import createPalette from 'material-ui/styles/palette';
import { lightGreen, orange, red } from 'material-ui/colors';

export default {
  // App spacing config. Sets the size of various components.
  spacing: {
    unit: 8,
  },

  // App color palette
  palette: createPalette({
    primary: lightGreen,
    accent: orange,
    error: red,
    type: 'light',
  }),
};
