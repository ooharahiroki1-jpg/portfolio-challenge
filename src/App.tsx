import { Layout } from './components/layout/Layout';
import { useGame } from './context/GameProvider';
import { DetailedReportScreen } from './screens/DetailedReportScreen';
import { EventRevealScreen } from './screens/EventRevealScreen';
import { FinalResultsScreen } from './screens/FinalResultsScreen';
import { FullScreenPriceBoard } from './screens/FullScreenPriceBoard';
import { MainDashboard } from './screens/MainDashboard';
import { NewsBriefingScreen } from './screens/NewsBriefingScreen';
import { RankingUpdateScreen } from './screens/RankingUpdateScreen';
import { RecoveryScreen } from './screens/RecoveryScreen';
import { SetupScreen } from './screens/SetupScreen';
import { ShockEventScreen } from './screens/ShockEventScreen';
import { StartScreen } from './screens/StartScreen';
import { ScenarioSelectScreen } from './screens/ScenarioSelectScreen';
import { InitialInvestmentScreen } from './screens/InitialInvestmentScreen';
import { InitialOrderEntryScreen } from './screens/InitialOrderEntryScreen';
import { TeamAnalysisScreen } from './screens/TeamAnalysisScreen';
import { ThinkingTimeScreen } from './screens/ThinkingTimeScreen';

function ActiveScreen() {
  const { state } = useGame();
  switch (state.gamePhase) {
    case 'start':
      return <StartScreen />;
    case 'setup':
      return <SetupScreen />;
    case 'scenario-select':
      return <ScenarioSelectScreen />;
    case 'initial-investment':
      return <InitialInvestmentScreen />;
    case 'initial-order':
      return <InitialOrderEntryScreen />;
    case 'dashboard':
      return <MainDashboard />;
    case 'news':
      return <NewsBriefingScreen />;
    case 'thinking':
      return <ThinkingTimeScreen />;
    case 'price-board':
      return <FullScreenPriceBoard />;
    case 'team-analysis':
      return <TeamAnalysisScreen />;
    case 'order':
      return <InitialOrderEntryScreen />;
    case 'event':
      return <EventRevealScreen />;
    case 'asset-update':
      return <FullScreenPriceBoard />;
    case 'ranking-update':
      return <RankingUpdateScreen />;
    case 'shock':
      return <ShockEventScreen />;
    case 'post-shock':
      return <InitialOrderEntryScreen emergency />;
    case 'recovery':
      return <RecoveryScreen />;
    case 'results':
      return <FinalResultsScreen />;
    case 'report':
      return <DetailedReportScreen />;
    default:
      return <StartScreen />;
  }
}

export default function App() {
  return (
    <Layout>
      <ActiveScreen />
    </Layout>
  );
}
