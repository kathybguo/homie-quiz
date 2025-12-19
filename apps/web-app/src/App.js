import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Lobby from "./components/Lobby/Lobby";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/join" />
          <Route path="/:code" element={<Lobby />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
