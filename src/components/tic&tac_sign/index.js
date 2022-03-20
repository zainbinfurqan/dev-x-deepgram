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
      {props.ticSign == 'circle' && <div className="tictac-sign-round" />}
      {props.ticSign == 'square' && <div className="tictac-sign-block" />}
    </div>
  );
}

export default TicTacSign;
