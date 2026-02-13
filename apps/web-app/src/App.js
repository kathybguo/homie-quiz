import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { fairyDustCursor } from "cursor-effects";
import Landing from "./pages/Landing/Landing.js";
import Host from "./pages/Host/Host.js";
import Join from "./pages/Join/Join.js";
import Player from "./pages/Player/Player.js";
import "./styles/global.css";

function App() {
  useEffect(() => {
    const cursor = fairyDustCursor({
      colors: [
        "#FFB3D9",
        "#C8B3FF",
        "#B3E5FF",
        "#FFF3B3",
        "#FFD9B3",
        "#B3FFE5",
        "#FFFFFF",
      ],
    });
    return () => cursor.destroy();
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/join" element={<Join />} />
          <Route path="/:code" element={<Host />} />
          <Route path="/:code/:name" element={<Player />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
