import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firbaseMethods } from "../../utils/firebase.utilities";
import { localStorageMethods } from "../../utils/localstorage.utilities";
import "./style.css";

function CreateRoom(props) {
  const history = useNavigate()
  const [room, setRoom] = useState('');
  const [roomPassword, setRoomPassword] = useState('')

  const handleCreateRoom = async () => {
    try {
      const data = { room, roomPassword };
      const { userId } = await localStorageMethods.getItem('user');
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
      await localStorageMethods.setItem('game', { gameId: response.gameId })
      history('/game')
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div>
      <div className="create-room-">
        <div className="form-panel">
          <input type="text" value={room} placeholder="Room name" onChange={(e) => setRoom(e.target.value)} />
          <input type="text" value={roomPassword} placeholder="Password" onChange={(e) => setRoomPassword(e.target.value)} />
          <button onClick={handleCreateRoom}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
