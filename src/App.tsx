import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GameProvider, useGameState } from './context/GameContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import HistoryScreen from './components/HistoryScreen';
import ResultsScreen from './components/ResultsScreen';

type Screen = 'game' | 'history';

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const state = useGameState();
  const [screen, setScreen] = useState<Screen>('game');

  const hasGame = state.players.length > 0;

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <LanguageSwitcher />
      </header>
      <main>
        {!hasGame && <SetupScreen />}
        {hasGame && !state.isFinished && screen === 'game' && (
          <GameScreen onShowHistory={() => setScreen('history')} />
        )}
        {hasGame && !state.isFinished && screen === 'history' && (
          <HistoryScreen onBack={() => setScreen('game')} />
        )}
        {hasGame && state.isFinished && <ResultsScreen />}
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <GameProvider>
    <AppContent />
  </GameProvider>
);

export default App;
