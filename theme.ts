import {
  DarkTheme,
  DefaultTheme,
  Theme,
} from "expo-router/build/react-navigation";

export const THEME_COLORS: {
  light: Theme["colors"];
  dark: Theme["colors"];
} = {
  light: {
    background: "hsl(0 0% 100%)",
    border: "hsl(240 5.9% 90%)",
    card: "hsl(0 0% 100%)",
    notification: "hsl(0 84.2% 60.2%)",
    primary: "#F5004F",
    text: "#000",
  },
  dark: {
    background: "hsl(0 0% 3.9%)",
    border: "hsl(240 3.7% 15.9%)",
    card: "#111",
    notification: "hsl(0 62.8% 30.6%)",
    primary: "#F5004F",
    text: "#fff",
  },
};

export const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: THEME_COLORS.dark,
};

export const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: THEME_COLORS.light,
};
