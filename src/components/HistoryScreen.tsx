import { useTranslation } from 'react-i18next';
import { useGameState, useGameDispatch } from '../context/GameContext';
import styles from './HistoryScreen.module.css';

interface HistoryScreenProps {
  onBack: () => void;
  onUndo: (scores: string[], winnerIndex: number | null) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, onUndo }) => {
  const { t } = useTranslation();
  const state = useGameState();
  const dispatch = useGameDispatch();

  const handleUndo = () => {
    const lastRound = state.rounds[state.rounds.length - 1];
    dispatch({ type: 'UNDO_LAST' });
    if (lastRound.isDraw) {
      onUndo(['', '', '', ''], null);
    } else {
      onUndo(lastRound.scores.map(String), lastRound.winnerIndex);
    }
  };

  return (
    <div className={styles.history}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← {t('history.back')}
        </button>
        <h2 className={styles.title}>{t('history.title')}</h2>
      </div>

      {state.rounds.length === 0 ? (
        <p className={styles.empty}>{t('history.empty')}</p>
      ) : (
        <>
          <div className={styles.list}>
            {state.rounds.map((round) => (
              <div key={round.roundNumber} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.roundNum}>
                    #{round.roundNumber}
                  </span>
                  <span className={styles.windInfo}>
                    {t(`winds.${round.windRound}`)} {round.windRoundNumber}/4
                  </span>
                  <span className={styles.eastInfo}>
                    {t('history.east')}: {state.players[round.eastIndex].name}
                  </span>
                </div>

                {round.isDraw ? (
                  <div className={styles.drawLabel}>{t('history.drawResult')}</div>
                ) : (
                  <div className={styles.itemBody}>
                    <div className={styles.winner}>
                      {t('history.winner')}: {state.players[round.winnerIndex!].name} ({round.scores[round.winnerIndex!]})
                    </div>
                    <div className={styles.transfers}>
                      {round.transfers.map((tr, i) => (
                        <span key={i} className={styles.transfer}>
                          {state.players[tr.from].name} → {state.players[tr.to].name}: {tr.amount}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className={styles.undoButton}
            onClick={handleUndo}
          >
            {t('history.undo')}
          </button>
        </>
      )}
    </div>
  );
};

export default HistoryScreen;
