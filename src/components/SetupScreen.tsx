import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameDispatch } from '../context/GameContext';
import styles from './SetupScreen.module.css';

const SetupScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useGameDispatch();

  const [names, setNames] = useState(['', '', '', '']);
  const [eastIndex, setEastIndex] = useState(0);

  const handleNameChange = (index: number, value: string) => {
    setNames(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const canStart = names.every(n => n.trim().length > 0);

  const handleStart = () => {
    if (!canStart) return;
    dispatch({
      type: 'START_GAME',
      names: names.map(n => n.trim()),
      eastIndex,
      locale: i18n.language,
    });
  };

  return (
    <div className={styles.setup}>
      <div className={styles.players}>
        {names.map((name, i) => (
          <div key={i} className={styles.playerRow}>
            <input
              className={styles.nameInput}
              type="text"
              placeholder={`${t('setup.playerName')} ${i + 1}`}
              value={name}
              onChange={e => handleNameChange(i, e.target.value)}
              autoFocus={i === 0}
            />
            <button
              className={`${styles.eastButton} ${eastIndex === i ? styles.eastActive : ''}`}
              type="button"
              onClick={() => setEastIndex(i)}
              title={t('winds.east')}
            >
              東
            </button>
          </div>
        ))}
      </div>

      <p className={styles.eastHint}>{t('setup.selectEast')}</p>

      <button
        className={styles.startButton}
        onClick={handleStart}
        disabled={!canStart}
      >
        {t('setup.startGame')}
      </button>
    </div>
  );
};

export default SetupScreen;
