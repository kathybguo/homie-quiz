import { add } from "utils"; // import here
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  // const result = add(2, 3);

  return (
    <Router>
      <div className="App">
        <h1>LANDING</h1>
        <nav>
          <button>
            <Link to="/host">Host</Link>
          </button>
          <button>
            <Link to="/join">Join</Link>
          </button>
        </nav>

        <Routes>
          <Route path="/" />
          <Route path="/host" />
          <Route path="/join" />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
