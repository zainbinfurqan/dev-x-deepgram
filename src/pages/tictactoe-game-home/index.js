import React, { useEffect } from "react";
import Rooms from "../../components/rooms";
import CreateRoom from "../../components/rooms/create";
import JoinRoom from "../../components/rooms/join";
import { firbaseMethods } from '../../utils/firebase.utilities'
function TicTacToeHome(props) {

  useEffect(async () => {

  }, [])

  return (
    <div className="d-flex main-container-tictactoe-home" style={{
      fontFamily: '"Indie Flower", cursive'
    }}>
      <div className="w-75">
        <CreateRoom />
      </div>
      <div className="w-25">
        <Rooms />
      </div>
    </div>
  );
}

export default TicTacToeHome;
