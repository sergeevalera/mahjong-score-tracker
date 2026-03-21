import type { Transfer } from '../types';

export interface CalculationInput {
  scores: number[];
  winnerIndex: number;
  eastIndex: number;
}

export interface CalculationResult {
  transfers: Transfer[];
  balanceChanges: number[];
}

export const calculateHand = (input: CalculationInput): CalculationResult => {
  const { scores, winnerIndex, eastIndex } = input;
  const n = 4;

  // transfers[i][j] = amount player i pays to player j
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0) as number[]);

  // Step 1: Each loser pays the winner
  for (let L = 0; L < n; L++) {
    if (L === winnerIndex) continue;
    let payment = scores[winnerIndex];
    if (L === eastIndex || winnerIndex === eastIndex) {
      payment *= 2;
    }
    matrix[L][winnerIndex] += payment;
  }

  // Step 2: Losers settle among themselves
  const losers = Array.from({ length: n }, (_, i) => i).filter(i => i !== winnerIndex);
  for (let a = 0; a < losers.length; a++) {
    for (let b = a + 1; b < losers.length; b++) {
      const L1 = losers[a];
      const L2 = losers[b];
      const diff = Math.abs(scores[L1] - scores[L2]);
      if (diff === 0) continue;

      const cheaper = scores[L1] < scores[L2] ? L1 : L2;
      const expensive = scores[L1] < scores[L2] ? L2 : L1;

      let payment = diff;
      if (cheaper === eastIndex || expensive === eastIndex) {
        payment *= 2;
      }
      matrix[cheaper][expensive] += payment;
    }
  }

  // Step 3: Compute balance changes from the transfer matrix
  const balanceChanges = Array(n).fill(0) as number[];
  const transfers: Transfer[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const net = matrix[i][j] - matrix[j][i];
      if (net > 0) {
        transfers.push({ from: i, to: j, amount: net });
        balanceChanges[i] -= net;
        balanceChanges[j] += net;
      } else if (net < 0) {
        transfers.push({ from: j, to: i, amount: -net });
        balanceChanges[j] += net;
        balanceChanges[i] -= net;
      }
    }
  }

  return { transfers, balanceChanges };
};
