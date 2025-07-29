import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";
import SharedResultPage from "./pages/SharedResultPage";
import IntroPage from "./pages/IntroPage";

function App() {
  const isMobile = /iPhone|Android|Mobile/i.test(navigator.userAgent);

  if (isMobile) {
    return (
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/shared/:shareId" element={<SharedResultPage />} />
      </Routes>
    );
  }

  return (
    <div className="web-wrapper">
      <div className="web-app">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/shared/:shareId" element={<SharedResultPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
