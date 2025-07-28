import '@/styles/globals.css';
import { Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';
import IntroPage from './pages/IntroPage';

function App() {
  return (
    <div className="w-full flex justify-center bg-[#f8f8f8] min-h-[100dvh]">
      <div className="w-full max-w-[768px] min-w-[320px] bg-white scrollbar-hide min-h-[100dvh] relative">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
