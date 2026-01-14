import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing/Landing.js";
import Host from "./components/Host/Host.js";
import Join from "./components/Join/Join.js";
import Player from "./components/Player/Player.js";

function App() {
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
