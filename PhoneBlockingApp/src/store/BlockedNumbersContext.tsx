import React, {createContext, useContext, useEffect, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface State {
  numbers: string[];
}

type Action =
  | {type: 'load'; numbers: string[]}
  | {type: 'add'; number: string}
  | {type: 'remove'; number: string};

const STORAGE_KEY = '@blocked_numbers';

const BlockedNumbersStateContext = createContext<State | undefined>(undefined);
const BlockedNumbersDispatchContext = createContext<{
  addNumber: (n: string) => void;
  removeNumber: (n: string) => void;
} | undefined>(undefined);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'load':
      return {numbers: action.numbers};
    case 'add':
      if (state.numbers.includes(action.number)) {
        return state;
      }
      return {numbers: [...state.numbers, action.number]};
    case 'remove':
      return {numbers: state.numbers.filter(n => n !== action.number)};
    default:
      return state;
  }
}

export const BlockedNumbersProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {numbers: []});

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const nums = JSON.parse(raw) as string[];
          dispatch({type: 'load', numbers: nums});
        }
      } catch (e) {
        console.warn('Failed to load numbers', e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.numbers)).catch(e =>
      console.warn('Failed to save numbers', e),
    );
  }, [state.numbers]);

  const addNumber = (number: string) => dispatch({type: 'add', number});
  const removeNumber = (number: string) => dispatch({type: 'remove', number});

  return (
    <BlockedNumbersDispatchContext.Provider value={{addNumber, removeNumber}}>
      <BlockedNumbersStateContext.Provider value={state}>
        {children}
      </BlockedNumbersStateContext.Provider>
    </BlockedNumbersDispatchContext.Provider>
  );
};

export function useBlockedNumbers() {
  const state = useContext(BlockedNumbersStateContext);
  const dispatch = useContext(BlockedNumbersDispatchContext);
  if (!state || !dispatch) {
    throw new Error('useBlockedNumbers must be used within BlockedNumbersProvider');
  }
  return {numbers: state.numbers, ...dispatch};
}
