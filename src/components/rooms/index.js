import React, { useEffect, useState } from "react";
import { firbaseMethods } from "../../utils/firebase.utilities";
import { firebaseInstance } from '../../configuration/firebase'
import "./style.css";
import JoinRoom from "./join";
import { useNavigate } from "react-router-dom";
import { localStorageMethods } from "../../utils/localstorage.utilities";
const db = firebaseInstance.firestore()

function Rooms(props) {
  const history = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState({});
  const [openEnterRoompanel, setOpenEnterRoomPanel] = useState(false)

  useEffect(() => {
    fetchRoom()
  }, [])

  const fetchRoom = async () => {
    const response = db.collection('rooms')
    response.onSnapshot(querySnapshot => {
      const responseContent = querySnapshot.docs.map(doc => {
        let data = { room: doc.data().room, roomPassword: doc.data().roomPassword, id: doc.id, gameId: doc.data().gameId, users: doc.data().users }
        return { ...data }
      })
      setRooms([...responseContent])
    }, err => {
      return err
    })
  }

  const handleEnterRoom = async (data) => {
    setSelectedRoom(data)
    setOpenEnterRoomPanel(!openEnterRoompanel)
  }

  const handleClose = async () => {
    setOpenEnterRoomPanel(!openEnterRoompanel)
  }

  const handleConfirm = async (password) => {
    setOpenEnterRoomPanel(!openEnterRoompanel)
    delete selectedRoom.roomPassword
    //getting user data from local storage
    const { userId } = await localStorageMethods.getItem('user');
    //join room
    const response = await firbaseMethods.joinGame(password, selectedRoom, userId)
    if (response) {
      console.log(response)
      await localStorageMethods.setItem('room', { ...response })
      await localStorageMethods.setItem('tictactoe-game', { gameId: response.gameId })
      history('/game-tictactoe')
    }
  }

  return (
    <div className="rooms-container bg-white p-3 m-3">
      <h4>Game List</h4>
      {console.log(openEnterRoompanel)}
      {openEnterRoompanel && <JoinRoom
        openEnterRoompanel={openEnterRoompanel}
        handleConfirm={handleConfirm}
        handleClose={handleClose} />}
      {rooms.length > 0 && rooms.map((item, index) => {
        return (
          <div onClick={item?.users && item.users.length < 2 ? () => handleEnterRoom(item) : () => { }} key={index} className="d-flex single-room-container">
            <p className="text-black px-2">{item.room}</p>
            {item?.users && item.users.length == 2 && <p className="text-black px-2 font-weight-bold text-danger">Room full</p>}
          </div>
        );
      })}
    </div >
  );
}

export default Rooms;
