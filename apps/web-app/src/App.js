import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Lobby from "./components/Lobby/Lobby";
import Join from "./components/Join/Join";
import GamePage from "./components/GamePage/GamePage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/join" element={<Join />} />
          <Route path="/:code" element={<Lobby />} />
          <Route path="/:code/:name" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
