/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, type Dispatch } from 'react';
import type { GameState } from '../types';
import { gameReducer, type GameAction } from '../logic/gameState';
import { saveGameState, loadGameState } from '../logic/storage';

const emptyState: GameState = {
  players: [],
  rounds: [],
  currentRound: 1,
  currentEastIndex: 0,
  isFinished: false,
  locale: 'ru',
};

const GameStateContext = createContext<GameState>(emptyState);
const GameDispatchContext = createContext<Dispatch<GameAction>>(() => {});

export const useGameState = () => useContext(GameStateContext);
export const useGameDispatch = () => useContext(GameDispatchContext);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const saved = loadGameState();
  const [state, rawDispatch] = useReducer(gameReducer, saved ?? emptyState);

  const dispatch = useCallback((action: GameAction) => {
    rawDispatch(action);
    // Save synchronously right after reducer runs.
    // We compute the next state ourselves to avoid the useEffect delay.
    const nextState = gameReducer(state, action);
    if (nextState.players.length > 0) {
      saveGameState(nextState);
    }
  }, [state]);

  return (
    <GameStateContext value={state}>
      <GameDispatchContext value={dispatch}>
        {children}
      </GameDispatchContext>
    </GameStateContext>
  );
};
