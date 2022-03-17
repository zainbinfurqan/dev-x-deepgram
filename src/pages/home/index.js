import React, { useEffect } from "react";
import Rooms from "../../components/rooms";
import CreateRoom from "../../components/rooms/create";
import JoinRoom from "../../components/rooms/join";
import { firbaseMethods } from '../../utils/firebase.utilities'
function Home(props) {

  useEffect(async () => {

  }, [])

  return (
    <div>
      <Rooms />
      <CreateRoom />
      <JoinRoom />
    </div>
  );
}

export default Home;
