import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import TictacTao from "./pages/tictactao";
import Login from "./pages/login";
import TicTacToeHome from "./pages/tictactoe-game-home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import GamesList from "./pages/gameslist";
import VoiceAlphabates from "./pages/voice-alphabates";
import VoiceTheAlphabetsHome from "./pages/voice-alphabates-home";
// import { Deepgram } from "@deepgram/sdk";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="games-list" element={<GamesList />} />
        <Route path="game-tictactoe-home" element={<TicTacToeHome />} />
        <Route path="game-tictactoe" element={<TictacTao />} />
        <Route path="game-voice-alphabates-home" element={<VoiceTheAlphabetsHome />} />
        <Route path="game-voice-alphabates" element={<VoiceAlphabates />} />
      </Routes>
    </Router>
  );
}

export default App;
