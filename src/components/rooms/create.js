import React, { useState } from "react";
import { firbaseMethods } from "../../utils/firebase.utilities";
import "./style.css";

function CreateRoom(props) {
  const [room, setRoom] = useState('');
  const [roomPassword, setRoomPassword] = useState('')

  const handleCreateRoom = async () => {
    const data = { room, roomPassword };
    const response = await firbaseMethods.createRoom(data);
    console.log(response)
  }

  return (
    <div>
      <div class="create-room-page">
        <div class="form">
          <input type="text" value={room} placeholder="Room name" onChange={(e) => setRoom(e.target.value)} />
          <input type="text" value={roomPassword} placeholder="Password" onChange={(e) => setRoomPassword(e.target.value)} />
          <button onClick={handleCreateRoom}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
