import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState, useGameDispatch } from '../context/GameContext';
import HandResult from './HandResult';
import type { Round } from '../types';
import { clearGameState } from '../logic/storage';
import { getPrevailingIndex, getWindRound } from '../logic/gameState';
import ShareButton from './ShareButton';
import styles from './GameScreen.module.css';

const WIND_KANJI = { east: '東', south: '南', west: '西', north: '北' } as const;

interface GameScreenProps {
  onShowHistory: () => void;
  initialScores?: string[];
  initialWinnerIndex?: number | null;
}

const GameScreen: React.FC<GameScreenProps> = ({ onShowHistory, initialScores, initialWinnerIndex }) => {
  const { t } = useTranslation();
  const state = useGameState();
  const dispatch = useGameDispatch();

  const [scores, setScores] = useState(initialScores ?? ['', '', '', '']);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(initialWinnerIndex ?? null);
  const [shownResult, setShownResult] = useState<Round | null>(null);
  const [prevRoundCount, setPrevRoundCount] = useState(state.rounds.length);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

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

  const windRoundKey = getWindRound(state.currentRound);
  const prevailingIndex = getPrevailingIndex(state.currentEastIndex, windRoundKey);
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
            className={`${styles.balanceItem} ${i === prevailingIndex ? styles.eastPlayer : ''}`}
          >
            <span className={styles.playerName}>
              {p.name}
              {i === state.currentEastIndex && <span className={styles.eastBadge}>東</span>}
              {i === prevailingIndex && i !== state.currentEastIndex && (
                <span className={styles.eastBadge}>{WIND_KANJI[windRoundKey]}</span>
              )}
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

      <div className={styles.footer}>
        {state.rounds.length > 0 && (
          <button className={styles.historyButton} onClick={onShowHistory}>
            {t('history.title')} ({state.rounds.length})
          </button>
        )}
        <ShareButton />
        <button
          className={styles.newGameButton}
          onClick={() => setConfirmingReset(true)}
        >
          {t('results.newGame')}
        </button>
      </div>

      {confirmingReset && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmPanel}>
            <p className={styles.confirmText}>{t('confirm.typePlayerName')}</p>
            <input
              className={styles.confirmInput}
              type="text"
              placeholder={t('confirm.placeholder')}
              value={confirmInput}
              onChange={e => setConfirmInput(e.target.value)}
              autoFocus
            />
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmCancel}
                onClick={() => { setConfirmingReset(false); setConfirmInput(''); }}
              >
                {t('confirm.cancel')}
              </button>
              <button
                className={styles.confirmOk}
                disabled={!state.players.some(p => p.name.toLowerCase() === confirmInput.trim().toLowerCase())}
                onClick={() => { clearGameState(); dispatch({ type: 'NEW_GAME' }); }}
              >
                {t('results.newGame')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
