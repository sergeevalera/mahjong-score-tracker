import type { GameState, Round, WindRound } from '../types';
import { calculateHand } from './calculate';

const WIND_ORDER: WindRound[] = ['east', 'south', 'west', 'north'];

export const getWindRound = (roundNumber: number): WindRound => {
  return WIND_ORDER[Math.floor((roundNumber - 1) / 4)];
};

// Player whose seat wind matches the prevailing (round) wind — gets the ×2 multiplier.
// Seat winds follow the dealer order from the East seat: East → South → West → North.
export const getPrevailingIndex = (eastIndex: number, windRound: WindRound): number => {
  return (eastIndex + WIND_ORDER.indexOf(windRound)) % 4;
};

const getWindRoundNumber = (roundNumber: number): number => {
  return ((roundNumber - 1) % 4) + 1;
};

export type GameAction =
  | { type: 'START_GAME'; names: string[]; eastIndex: number; locale: string }
  | { type: 'PLAY_HAND'; scores: number[]; winnerIndex: number }
  | { type: 'DRAW' }
  | { type: 'UNDO_LAST' }
  | { type: 'NEW_GAME' }
  | { type: 'RESTORE'; state: GameState };

export const createInitialState = (
  names: string[],
  eastIndex: number,
  locale: string,
): GameState => ({
  players: names.map(name => ({ name, balance: 0 })),
  rounds: [],
  currentRound: 1,
  currentEastIndex: eastIndex,
  isFinished: false,
  locale,
});

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return createInitialState(action.names, action.eastIndex, action.locale);

    case 'PLAY_HAND': {
      if (state.isFinished) return state;

      const { scores, winnerIndex } = action;
      const { transfers, balanceChanges } = calculateHand({
        scores,
        winnerIndex,
        eastIndex: getPrevailingIndex(state.currentEastIndex, getWindRound(state.currentRound)),
      });

      const newPlayers = state.players.map((p, i) => ({
        ...p,
        balance: p.balance + balanceChanges[i],
      }));

      const round: Round = {
        roundNumber: state.currentRound,
        windRound: getWindRound(state.currentRound),
        windRoundNumber: getWindRoundNumber(state.currentRound),
        eastIndex: state.currentEastIndex,
        isDraw: false,
        winnerIndex,
        scores,
        transfers,
        balanceChanges,
      };

      const nextRound = state.currentRound + 1;
      const nextEast =
        winnerIndex === state.currentEastIndex
          ? state.currentEastIndex
          : (state.currentEastIndex + 1) % 4;

      return {
        ...state,
        players: newPlayers,
        rounds: [...state.rounds, round],
        currentRound: nextRound,
        currentEastIndex: nextEast,
        isFinished: nextRound > 16,
      };
    }

    case 'DRAW': {
      if (state.isFinished) return state;

      const round: Round = {
        roundNumber: state.currentRound,
        windRound: getWindRound(state.currentRound),
        windRoundNumber: getWindRoundNumber(state.currentRound),
        eastIndex: state.currentEastIndex,
        isDraw: true,
        winnerIndex: null,
        scores: [0, 0, 0, 0],
        transfers: [],
        balanceChanges: [0, 0, 0, 0],
      };

      const nextRound = state.currentRound + 1;

      return {
        ...state,
        rounds: [...state.rounds, round],
        currentRound: nextRound,
        isFinished: nextRound > 16,
        // East does NOT move on draw
      };
    }

    case 'UNDO_LAST': {
      if (state.rounds.length === 0) return state;

      const lastRound = state.rounds[state.rounds.length - 1];
      const newRounds = state.rounds.slice(0, -1);

      const newPlayers = state.players.map((p, i) => ({
        ...p,
        balance: p.balance - lastRound.balanceChanges[i],
      }));

      return {
        ...state,
        players: newPlayers,
        rounds: newRounds,
        currentRound: lastRound.roundNumber,
        currentEastIndex: lastRound.eastIndex,
        isFinished: false,
      };
    }

    case 'NEW_GAME':
      return {
        players: [],
        rounds: [],
        currentRound: 1,
        currentEastIndex: 0,
        isFinished: false,
        locale: state.locale,
      };

    case 'RESTORE':
      return action.state;

    default:
      return state;
  }
};
