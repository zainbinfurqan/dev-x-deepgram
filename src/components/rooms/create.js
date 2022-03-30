import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firbaseMethods } from "../../utils/firebase.utilities";
import { localStorageMethods } from "../../utils/localstorage.utilities";
import GameInstructions from "../gameInstructions";
import "./style.css";

function CreateRoom(props) {
  const history = useNavigate()
  const [room, setRoom] = useState('');
  const [roomPassword, setRoomPassword] = useState('')
  const [GameInstructionsIsOpen, setGameInstructionsIsOpen] = useState(false)
  const handleCreateRoom = async () => {
    const { userId } = await localStorageMethods.getItem('user');
    const data = { room, roomPassword, users: [userId] };
    if (window.location.pathname == '/game-voice-alphabates-home') {
      try {
        const creatingGameCollectionForFirebase = {
          adminUser: await userId,
          users: userId,
          wrongAnswers: 0,
          riteAnswers: 0,
          alphabates: ['P', 'B', 'X', 'V', 'S', 'I', 'G', 'N', 'F', 'J', 'K', 'Y',
            'M', 'H', 'O', 'A', 'Q', 'R', 'E', 'T', 'U', 'D', 'W', 'C',
            'L', 'Z'],
          openNumbers: []
        }
        const response = await firbaseMethods.createRoomForVoiceTheAlphabateGame(data, creatingGameCollectionForFirebase);
        await localStorageMethods.setItem('room', { ...response })
        await localStorageMethods.setItem('voice-the-alphabate-game', { gameId: response.gameId })
        history('/game-voice-alphabates')
      } catch (error) {

      }
    }
    if (window.location.pathname == '/game-tictactoe-home') {
      try {
        const gameData = {
          adminUser: await userId,
          userTurn: await userId,
          isWin: false,
          wins: [],
          ticTacData: [],
          users: [userId],
        }
        gameData[userId] = 'square'
        const response = await firbaseMethods.createRoom(data, gameData);
        await localStorageMethods.setItem('room', { ...response })
        await localStorageMethods.setItem('tictactoe-game', { gameId: response.gameId })
        history('/game-tictactoe')
      } catch (error) {
        console.log(error)
      }
    }


  }

  return (
    <div className="create-room-">
      <GameInstructions isOpen={GameInstructionsIsOpen} handleClose={() => setGameInstructionsIsOpen(!GameInstructionsIsOpen)} />
      <div className="form-panel">
        <p className="text-black text-right font-weight-bold cursor-pointer" onClick={() => setGameInstructionsIsOpen(!GameInstructionsIsOpen)}>Game instructions!</p>
        <input type="text" value={room} placeholder="Room name" onChange={(e) => setRoom(e.target.value)} />
        <input type="text" value={roomPassword} placeholder="Password" onChange={(e) => setRoomPassword(e.target.value)} />
        <button onClick={handleCreateRoom}>Create</button>
      </div>
    </div>
  );
}

export default CreateRoom;
