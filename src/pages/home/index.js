import React from "react";
import Rooms from "../../components/rooms";
import CreateRoom from "../../components/rooms/create";
import JoinRoom from "../../components/rooms/join";


function Home(props) {
  return (
    <div>
      <Rooms />
      <CreateRoom/>
      <JoinRoom/>
    </div>
  );
}

export default Home;
