import React, { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";

function JoinRoom(props) {
  const [password, setPassword] = useState('')

  return (
    <div>
      <SweetAlert
        show={props.openEnterRoompanel}
        showCloseButton={true}
        onConfirm={() => props.handleConfirm(password)}
        title="Join Room"
        onCancel={() => props.handleClose()}
      >
        <div className="form m-auto p-3">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="text" placeholder="Password" />
        </div>
      </SweetAlert>
    </div>
  );
}

export default JoinRoom;
