import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameContext';
import type { Round } from '../types';
import styles from './HandResult.module.css';

interface HandResultProps {
  round: Round;
  onContinue: () => void;
}

const HandResult: React.FC<HandResultProps> = ({ round, onContinue }) => {
  const { t } = useTranslation();
  const state = useGameState();
  const players = state.players;

  return (
    <div className={styles.result}>
      <h2 className={styles.title}>
        {t('game.handResult')} #{round.roundNumber}
      </h2>

      {round.isDraw ? (
        <p className={styles.drawText}>{t('game.drawNoChanges')}</p>
      ) : (
        <>
          <div className={styles.transfers}>
            {round.transfers.map((tr, i) => (
              <div key={i} className={styles.transferRow}>
                <span className={styles.from}>{players[tr.from].name}</span>
                <span className={styles.arrow}>{t('game.pays')}</span>
                <span className={styles.to}>{players[tr.to].name}</span>
                <span className={styles.amount}>{tr.amount}</span>
              </div>
            ))}
          </div>

          <div className={styles.balanceChanges}>
            <h3 className={styles.subtitle}>{t('game.balanceChange')}</h3>
            {players.map((p, i) => {
              const change = round.balanceChanges[i];
              return (
                <div key={i} className={styles.changeRow}>
                  <span>{p.name}</span>
                  <span className={
                    change > 0 ? styles.positive :
                    change < 0 ? styles.negative :
                    styles.zero
                  }>
                    {change > 0 ? `+${change}` : change}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      <button className={styles.continueButton} onClick={onContinue}>
        {t('game.continue')}
      </button>
    </div>
  );
};

export default HandResult;
