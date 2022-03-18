import React, { useEffect, useState } from "react";
import { firbaseMethods } from "../../utils/firebase.utilities";
import { firebaseInstance } from '../../configuration/firebase'
import "./style.css";
import JoinRoom from "./join";
const db = firebaseInstance.firestore()

function Rooms(props) {
  const [rooms, setRooms] = useState([]);
  const [openEnterRoompanel, setOpenEnterRoomPanel] = useState(false)

  useEffect(() => {
    fetchRoom()
  }, [])

  const fetchRoom = async () => {
    const response = db.collection('rooms')
    response.onSnapshot(querySnapshot => {
      const responseContent = querySnapshot.docs.map(doc => {
        let data = { room: doc.data().room, roomPassword: doc.data().roomPassword, id: doc.id }
        return { ...data }
      })
      setRooms([...responseContent])
    }, err => {
      return err
    })
  }

  const handleEnterRoom = async (id) => {
    setOpenEnterRoomPanel(!openEnterRoompanel)
  }

  const handleClose = async () => {
    setOpenEnterRoomPanel(!openEnterRoompanel)
  }

  const handleConfirm = async () => {

  }

  return (
    <div className="rooms-container bg-white p-3 m-3">
      {openEnterRoompanel && <JoinRoom openEnterRoompanel={openEnterRoompanel} handleClose={handleClose} />}
      {rooms.length > 0 && rooms.map((item, index) => {
        return (
          <div onClick={() => handleEnterRoom(item.id)} className="single-room-container">
            <p className="text-black px-2">{item.room}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Rooms;
