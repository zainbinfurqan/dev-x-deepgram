import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

function JoinRoom(props) {

  return (
    <div>
      <SweetAlert
        show={props.openEnterRoompanel}
        showCloseButton={true}
        onConfirm={() => props.handleConfirm()}
        title="Join Room"
        onCancel={() => props.handleClose()}
      >
        <div class="form m-auto p-3">
          <input type="text" placeholder="Password" />
        </div>
      </SweetAlert>
    </div>
  );
}

export default JoinRoom;
