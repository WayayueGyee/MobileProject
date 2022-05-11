import {
  FunctionBlock,
  LoopBlock,
  InitBlock,
  ConditionalOperator,
} from "./../types/Types";

export declare function FunctionComponent({
  name,
  args,
}: FunctionBlock): JSX.Element;

export declare function LoopComponent({ expression }: LoopBlock): JSX.Element;

export declare function InitComponent({
  name,
  expression,
}: InitBlock): JSX.Element;

export declare function ConditionalComponent({
  type,
  expression,
}: ConditionalOperator): JSX.Element;
