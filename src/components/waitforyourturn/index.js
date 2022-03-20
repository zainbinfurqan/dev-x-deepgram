import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert'

function WaitForYourTurn(props) {
    return (
        <SweetAlert
            show={props.isWating}
            showCloseButton={false}
            showConfirm={false}
        >
            <p>Wait for your turn</p>
        </SweetAlert>
    );
}

export default WaitForYourTurn;