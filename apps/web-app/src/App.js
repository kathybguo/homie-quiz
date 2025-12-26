import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Host from "./components/Host/Host";
import Join from "./components/Join/Join";
import Player from "./components/Player/Player";

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
