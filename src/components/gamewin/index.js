import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert'

function GameWinner(props) {
    return (
        <SweetAlert
            show={props.isWin}
            showCloseButton={false}
            showConfirm={false}
        >
            <p>{props.user[props.user.length - 1]} Win this match</p>
            <button className='p-3' style={{
                border: '0px',
                backgroundColor: 'green',
            }} onClick={props.handleStartNewGame}>Start new Game</button>
        </SweetAlert>
    );
}

export default GameWinner;