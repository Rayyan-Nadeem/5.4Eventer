import { createTheme } from '@mantine/core';
import { generateColors } from '@mantine/colors-generator';

export const theme = createTheme({
  primaryColor: 'blue', // Sets 'blue' as the primary color
  primaryShade: 9,      // Uses the 9th shade of the 'blue' color
  colors: {
    blue: ['#E7F5FF', '#D0EBFF', '#A5D8FF', '#74C0FC', '#4DABF7', '#339AF0', '#228BE6', '#1C7ED6', '#1971C2', '#1864AB'],
    red : generateColors('#cc0000'),
  },
});
