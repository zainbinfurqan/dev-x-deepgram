import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import TictacTao from "./pages/tictactao";
import Login from "./pages/login";
import Home from "./pages/home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import GamesList from "./pages/gameslist";
// import { Deepgram } from "@deepgram/sdk";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="game-tictactoe-home" element={<Home />} />
        <Route path="games-list" element={<GamesList />} />
        <Route path="game-tictactoe" element={<TictacTao />} />
      </Routes>
    </Router>
  );
}

export default App;
