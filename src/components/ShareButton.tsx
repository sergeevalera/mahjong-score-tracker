import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameContext';
import { encodeStateToUrl } from '../logic/storage';
import styles from './ShareButton.module.css';

const ShareButton: React.FC = () => {
  const { t } = useTranslation();
  const state = useGameState();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = encodeStateToUrl(state);

    if (navigator.share) {
      try {
        await navigator.share({ title: t('share.title'), url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — prompt select
      prompt(t('share.copied'), url);
    }
  };

  return (
    <button className={styles.share} onClick={handleShare}>
      {copied ? t('share.copied') : t('share.button')}
    </button>
  );
};

export default ShareButton;
