import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert'

function GameInstructions(props) {
    return (
        <SweetAlert
            show={props.isOpen}
            showCancel={true}
            showConfirm={false}
            onCancel={props.handleClose}
        >
            <div>
                <ul className='text-left'>
                    <li className=''>Any two users can play this game</li>
                    <li>Your Mic access requried to play this game</li>
                    <li>You can select language from the given list</li>
                    <li>Terms/Comands for user sign e.g. "one one"</li>
                </ul>
            </div>
        </SweetAlert>
    );
}

export default GameInstructions;