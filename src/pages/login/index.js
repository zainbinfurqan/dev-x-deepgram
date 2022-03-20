import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firbaseMethods } from "../../utils/firebase.utilities";
import { localStorageMethods } from "../../utils/localstorage.utilities";
import "./style.css";

function Login(props) {
  const history = useNavigate()
  const [userName, setUserName] = useState('')

  const handleLogin = async () => {
    try {
      const user = { user: userName + Math.floor(Math.random() * 10000) }
      const respons = await firbaseMethods.createUser(user)
      if (respons) {
        localStorageMethods.setItem('user', { ...user, userId: respons })
        setUserName('');
        history('/home')
      }
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div>
      <div className="login-page">
        <div className="form">
          <input type="text" onChange={(e) => setUserName(e.target.value)} placeholder="Name" />
          <button onClick={handleLogin}>create/login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
