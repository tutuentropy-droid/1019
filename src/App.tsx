import { useAppStore } from '@/store/useAppStore';
import StarfieldBackground from '@/components/StarfieldBackground';
import Home from '@/pages/Home';
import SimulatePage from '@/pages/SimulatePage';
import ResultPage from '@/pages/ResultPage';
import MemoryPage from '@/pages/MemoryPage';

export default function App() {
  const stage = useAppStore((s) => s.stage);

  return (
    <div className="min-h-screen bg-cosmos-900 relative overflow-hidden">
      <StarfieldBackground />
      <div className="noise-overlay" />

      <div key={stage} className="relative z-10 animate-fade-in">
        {stage === 'home' && <Home />}
        {stage === 'simulating' && <SimulatePage />}
        {stage === 'result' && <ResultPage />}
        {stage === 'memory' && <MemoryPage />}
      </div>
    </div>
  );
}
