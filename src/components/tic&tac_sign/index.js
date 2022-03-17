import React from "react";
import "./style.css";

function TicTacSign(props) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: "30px",
      }}
    >
      {false && <div className="tictac-sign-round" />}
      {true && <div className="tictac-sign-block" />}
    </div>
  );
}

export default TicTacSign;
