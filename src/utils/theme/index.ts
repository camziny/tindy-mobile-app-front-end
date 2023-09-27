import { createTheme, createBox, createText } from "@shopify/restyle";
import { colors } from "./colors";
import { textVariants } from "./text-variants";
import Animated from "react-native-reanimated";

const theme = createTheme({
  colors: colors,
  spacing: {
    "1": 4,
    "2": 8,
    "3": 12,
    "3.5": 14,
    "4": 16,
    "5": 20,
    "5.5": 22,
    "6": 24,
    "10": 40,
    "11": 44,
    "12": 48,
    "13": 56,
    "14": 68,
    "15": 80,
    "16": 92,
    "17": 104,
    "18": 116,
  },
  borderRadii: {
    none: 0,
    rounded: 4,
    "rounded-xl": 8,
    "rounded-2xl": 10,
    "rounded-3xl": 12,
    "rounded-4xl": 16,
    "rounded-5xl": 20,
    "rounded-7xl": 28,
  },
  textVariants,
});

export type Theme = typeof theme;

export const Box = createBox<Theme>();
export const Text = createText<Theme>();
export const AnimatedText = Animated.createAnimatedComponent(Text);
export const AnimatedBox = Animated.createAnimatedComponent(Box);

export default theme;