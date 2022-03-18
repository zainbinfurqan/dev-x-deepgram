import React, { useState } from "react";
import { firbaseMethods } from "../../utils/firebase.utilities";
import "./style.css";

function Login(props) {
  const [userName, setUserName] = useState('')

  const handleLogin = async () => {
    const user = { user: userName + Math.floor(Math.random() * 10000) }
    const respons = await firbaseMethods.createUser(user)
    if (respons) {
      setUserName('')
    }
  }

  return (
    <div>
      <div class="login-page">
        <div class="form">
          <input type="text" onChange={(e) => setUserName(e.target.value)} placeholder="Name" />
          <button onClick={handleLogin}>create/login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
