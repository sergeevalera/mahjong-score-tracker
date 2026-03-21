import { useTranslation } from 'react-i18next';
import { useGameState, useGameDispatch } from '../context/GameContext';
import { clearGameState } from '../logic/storage';
import styles from './ResultsScreen.module.css';

interface Debt {
  from: number;
  to: number;
  amount: number;
}

const computeDebts = (balances: number[]): Debt[] => {
  const debts: Debt[] = [];
  // Clone balances to work with
  const remaining = [...balances];

  // Greedily settle: each debtor pays each creditor
  const debtors = remaining
    .map((b, i) => ({ i, b }))
    .filter(x => x.b < 0)
    .sort((a, b) => a.b - b.b); // most negative first

  const creditors = remaining
    .map((b, i) => ({ i, b }))
    .filter(x => x.b > 0)
    .sort((a, b) => b.b - a.b); // most positive first

  for (const debtor of debtors) {
    for (const creditor of creditors) {
      if (debtor.b >= 0) break;
      if (creditor.b <= 0) continue;

      const amount = Math.min(-debtor.b, creditor.b);
      if (amount > 0) {
        debts.push({ from: debtor.i, to: creditor.i, amount });
        debtor.b += amount;
        creditor.b -= amount;
      }
    }
  }

  return debts;
};

const ResultsScreen: React.FC = () => {
  const { t } = useTranslation();
  const state = useGameState();
  const dispatch = useGameDispatch();

  const sorted = state.players
    .map((p, i) => ({ ...p, index: i }))
    .sort((a, b) => b.balance - a.balance);

  const debts = computeDebts(state.players.map(p => p.balance));

  const handleNewGame = () => {
    clearGameState();
    dispatch({ type: 'NEW_GAME' });
  };

  return (
    <div className={styles.results}>
      <h2 className={styles.title}>{t('results.title')}</h2>

      <div className={styles.section}>
        <h3 className={styles.subtitle}>{t('results.finalBalances')}</h3>
        <div className={styles.standings}>
          {sorted.map((p, rank) => (
            <div key={p.index} className={styles.standingRow}>
              <span className={styles.rank}>{['🥇','🥈','🥉','4'][rank]}</span>
              <span className={styles.name}>{p.name}</span>
              <span className={
                p.balance > 0 ? styles.positive :
                p.balance < 0 ? styles.negative :
                styles.zero
              }>
                {p.balance > 0 ? `+${p.balance}` : p.balance}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subtitle}>{t('results.debts')}</h3>
        {debts.length === 0 ? (
          <p className={styles.noDebts}>{t('results.noDebts')}</p>
        ) : (
          <div className={styles.debtList}>
            {debts.map((d, i) => (
              <div key={i} className={styles.debtRow}>
                <span className={styles.debtFrom}>{state.players[d.from].name}</span>
                <span className={styles.debtArrow}>→</span>
                <span className={styles.debtTo}>{state.players[d.to].name}</span>
                <span className={styles.debtAmount}>{d.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className={styles.newGameButton} onClick={handleNewGame}>
        {t('results.newGame')}
      </button>
    </div>
  );
};

export default ResultsScreen;
