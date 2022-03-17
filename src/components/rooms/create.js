import React from "react";
import "./style.css";

function CreateRoom(props) {
  return (
    <div>
      <div class="create-room-page">
        <div class="form">
          <input type="text" placeholder="Room name" />
          <input type="text" placeholder="Password" />
          <button>Create</button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
