import React from "react";
import "./style.css";

function Login(props) {
  return (
    <div>
      <div class="login-page">
        <div class="form">
          <input type="text" placeholder="Name" />
          <button>create/login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
