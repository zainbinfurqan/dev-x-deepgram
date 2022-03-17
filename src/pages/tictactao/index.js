import React from "react";
import TicTacSign from "../../components/tic&tac_sign";
import "./style.css";

function TictacTao(props) {
  return (
    <div>
      <h2 className='text-white text-center p-5'>Tic Tac Tao</h2>
      <div className="game-main-container">
        <div className="row-1 d-flex">
          <div className="tac-box" id="one:one">
            <TicTacSign />
          </div>
          <div className="tac-box" id="one:two">
            <TicTacSign />
          </div>
          <div className="tac-box-last" id="one:three">
            <TicTacSign />
          </div>
        </div>
        <div className="row-2 d-flex">
          <div className="tac-box" id="two:one">
            <TicTacSign />
          </div>
          <div className="tac-box" id="two:two">
            <TicTacSign />
          </div>
          <div className="tac-box-last" id="two:three">
            <TicTacSign />
          </div>
        </div>
        <div className="row-3 d-flex">
          <div className="tac-box" id="three:one">
            <TicTacSign />
          </div>
          <div className="tac-box" id="three:two">
            <TicTacSign />
          </div>
          <div className="tac-box-last" id="three:three">
            <TicTacSign />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TictacTao;
