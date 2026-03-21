import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <button className={styles.button} onClick={toggleLanguage}>
      {i18n.language === 'ru' ? 'EN' : 'RU'}
    </button>
  );
};
