export interface Player {
  name: string;
  balance: number;
}

export type WindRound = 'east' | 'south' | 'west' | 'north';

export interface Transfer {
  from: number;
  to: number;
  amount: number;
}

export interface Round {
  roundNumber: number;
  windRound: WindRound;
  windRoundNumber: number;
  eastIndex: number;
  isDraw: boolean;
  winnerIndex: number | null;
  scores: number[];
  transfers: Transfer[];
  balanceChanges: number[];
}

export interface GameState {
  players: Player[];
  rounds: Round[];
  currentRound: number;
  currentEastIndex: number;
  isFinished: boolean;
  locale: string;
}
