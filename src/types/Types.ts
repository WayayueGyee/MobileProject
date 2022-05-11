// import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

// type StyleType =
//   | StyleProp<ViewStyle>
//   | StyleProp<TextStyle>
//   | StyleProp<ImageStyle>
//   | undefined
//   | Array<Record<string, unknown>>
//   | Record<string, unknown>;
// export default StyleType;

export interface IStyle {
  [key: string]: unknown | undefined;
}
export type Children = React.ReactNode[] | undefined;

export interface FunctionBlock {
  type: "2352";
  name: string;
  args?: string;
}

export interface LoopBlock {
  expression: string;
}

export interface InitBlock {
  name?: string;
  expression: string;
}

// enum Conditionals {
//   IF,
//   ELSE_IF,
//   ELSE,
// }

export interface ConditionalOperator {
  type: string; // "if", "elseif", "else"
  expression: string;
}

export interface ElementData {
  type: InitBlock | FunctionBlock | LoopBlock | ConditionalOperator;
  coordinates: { x: number; y: number };
  size: { width: number; height: number };
  content?: ElementData[];
}
export type ProgramData = ElementData[];
