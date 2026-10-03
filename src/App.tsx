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
  const [prefillScores, setPrefillScores] = useState<string[] | undefined>();
  const [prefillWinner, setPrefillWinner] = useState<number | null | undefined>();

  const hasGame = state.players.length > 0;

  const handleUndo = (scores: string[], winnerIndex: number | null) => {
    setPrefillScores(scores);
    setPrefillWinner(winnerIndex);
    setScreen('game');
  };

  const handleShowHistory = () => {
    setPrefillScores(undefined);
    setPrefillWinner(undefined);
    setScreen('history');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <LanguageSwitcher />
      </header>
      <main>
        {!hasGame && <SetupScreen />}
        {hasGame && !state.isFinished && screen === 'game' && (
          <GameScreen
            onShowHistory={handleShowHistory}
            initialScores={prefillScores}
            initialWinnerIndex={prefillWinner}
          />
        )}
        {hasGame && !state.isFinished && screen === 'history' && (
          <HistoryScreen onBack={() => setScreen('game')} onUndo={handleUndo} />
        )}
        {hasGame && state.isFinished && <ResultsScreen />}
      </main>
      <footer className="app-footer">
        {t('app.version', { version: __APP_VERSION__ })}
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <GameProvider>
    <AppContent />
  </GameProvider>
);

export default App;
