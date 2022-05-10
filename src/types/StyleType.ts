// import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

// type StyleType =
//   | StyleProp<ViewStyle>
//   | StyleProp<TextStyle>
//   | StyleProp<ImageStyle>
//   | undefined
//   | Array<Record<string, unknown>>
//   | Record<string, unknown>;
// export default StyleType;

export default interface IStyle {
  [key: string]: unknown | undefined;
}
