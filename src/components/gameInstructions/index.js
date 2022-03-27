import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert'

function GameInstructions(props) {
    return (
        <SweetAlert
            show={props.isOpen}
            showCancel={true}
            showConfirm={false}
        >
            <div>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </SweetAlert>
    );
}

export default GameInstructions;