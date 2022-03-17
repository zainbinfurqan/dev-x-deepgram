import React from "react";
import "./style.css";

function Rooms(props) {
  const rooms = [
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
    "room1",
  ];
  return (
    <div className="rooms-container bg-white">
      {rooms.map((item, index) => {
        return (
          <div className="single-room-container">
            <p className="text-black px-2">{item}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Rooms;
