import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState, useGameDispatch } from '../context/GameContext';
import HandResult from './HandResult';
import type { Round } from '../types';
import styles from './GameScreen.module.css';

interface GameScreenProps {
  onShowHistory: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onShowHistory }) => {
  const { t } = useTranslation();
  const state = useGameState();
  const dispatch = useGameDispatch();

  const [scores, setScores] = useState(['', '', '', '']);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [shownResult, setShownResult] = useState<Round | null>(null);
  const [prevRoundCount, setPrevRoundCount] = useState(state.rounds.length);

  // Detect newly added round (setState during render is fine for derived state)
  if (state.rounds.length > prevRoundCount) {
    setPrevRoundCount(state.rounds.length);
    setShownResult(state.rounds[state.rounds.length - 1]);
  }

  const handleScoreChange = (index: number, value: string) => {
    setScores(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const resetForm = () => {
    setScores(['', '', '', '']);
    setWinnerIndex(null);
  };

  const canCalculate =
    winnerIndex !== null &&
    scores.every(s => s.trim() !== '' && !isNaN(Number(s)) && Number(s) >= 0);

  const handleCalculate = () => {
    if (!canCalculate || winnerIndex === null) return;
    dispatch({
      type: 'PLAY_HAND',
      scores: scores.map(Number),
      winnerIndex,
    });
    resetForm();
  };

  const handleDraw = () => {
    dispatch({ type: 'DRAW' });
    resetForm();
  };

  if (shownResult) {
    return (
      <HandResult
        round={shownResult}
        onContinue={() => setShownResult(null)}
      />
    );
  }

  const windRoundKey = (['east', 'south', 'west', 'north'] as const)[
    Math.floor((state.currentRound - 1) / 4)
  ];
  const windRoundNumber = ((state.currentRound - 1) % 4) + 1;

  return (
    <div className={styles.game}>
      <div className={styles.status}>
        <span>
          {t(`winds.${windRoundKey}`)} {t('game.round').toLowerCase()} — {t('game.hand')} {windRoundNumber}/4
        </span>
        <span className={styles.handTotal}>
          ({state.currentRound}/16)
        </span>
      </div>

      <div className={styles.balances}>
        {state.players.map((p, i) => (
          <div
            key={i}
            className={`${styles.balanceItem} ${i === state.currentEastIndex ? styles.eastPlayer : ''}`}
          >
            <span className={styles.playerName}>
              {p.name}
              {i === state.currentEastIndex && <span className={styles.eastBadge}>東</span>}
            </span>
            <span className={styles.balanceValue}>
              {p.balance >= 0 ? `+${p.balance}` : p.balance}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.inputs}>
        {state.players.map((p, i) => (
          <div key={i} className={styles.playerInput}>
            <label className={styles.inputLabel}>{p.name}</label>
            <div className={styles.inputRow}>
              <input
                className={styles.scoreInput}
                type="number"
                inputMode="numeric"
                min="0"
                placeholder={t('game.score')}
                value={scores[i]}
                onChange={e => handleScoreChange(i, e.target.value)}
              />
              <button
                className={`${styles.mahjongButton} ${winnerIndex === i ? styles.mahjongActive : ''}`}
                type="button"
                onClick={() => setWinnerIndex(winnerIndex === i ? null : i)}
              >
                {t('game.mahjong')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.calculateButton}
          onClick={handleCalculate}
          disabled={!canCalculate}
        >
          {t('game.calculate')}
        </button>
        <button
          className={styles.drawButton}
          onClick={handleDraw}
        >
          {t('game.draw')}
        </button>
      </div>

      {state.rounds.length > 0 && (
        <button className={styles.historyButton} onClick={onShowHistory}>
          {t('history.title')} ({state.rounds.length})
        </button>
      )}
    </div>
  );
};

export default GameScreen;
