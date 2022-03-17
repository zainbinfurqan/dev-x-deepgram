import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

function JoinRoom(props) {
  return (
    <div>
      <SweetAlert
        show={true}
        showCloseButton={true}
        title="Join Room"
        onCancel={() => {}}
      >
        <div class="form m-auto p-3">
          <input type="text" placeholder="Password" />
        </div>
      </SweetAlert>
    </div>
  );
}

export default JoinRoom;
