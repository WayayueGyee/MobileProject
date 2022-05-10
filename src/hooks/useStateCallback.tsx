import { useState, useRef, useCallback, useEffect } from "react";

export declare type CallbackFunction = (() => void) | undefined;
export declare type StateType<T> =
  | T
  | ((prevState: Readonly<T>, props: Readonly<T>) => T | Pick<T, never> | null)
  | Pick<T, never>
  | null;
export declare type SetStateType<T> = {
  state: StateType<T>;
  callback?: CallbackFunction;
};

export default function useStateCallback<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const callbackRef = useRef<CallbackFunction>(); // init mutable ref container for callbacks

  const setStateCallback = useCallback(
    (state: T, callback: CallbackFunction = undefined) => {
      callbackRef.current = callback; // store current, passed callback in ref
      setState(state);
    },
    [],
  ); // keep object reference stable, exactly like `useState`

  useEffect(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (callbackRef.current) {
      callbackRef.current();
      callbackRef.current = undefined; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback] as const;
}
