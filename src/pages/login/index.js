import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { firbaseMethods } from "../../utils/firebase.utilities";
import { localStorageMethods } from "../../utils/localstorage.utilities";
import "./style.css";

function Login(props) {
  const history = useNavigate()
  const [userName, setUserName] = useState('')
  const [selectedValue, setSelectedValue] = useState({ value: "en", label: "English" });
  const options = [
    { value: "en", label: "English" },
    { value: "de", label: "Deutsch" },
    { value: "es_419", label: "Español – América Latina" },
    { value: "fr", label: "Français" },
    { value: "pt_br", label: "Português – Brasil" },
    { value: "zh_cn", label: "中文 – 简体" },
    { value: "ja", label: "日本語" },
  ];

  const handleLogin = async () => {
    try {
      const user = { user: userName + Math.floor(Math.random() * 10000), language: selectedValue.value }
      const respons = await firbaseMethods.createUser(user)
      if (respons) {
        localStorageMethods.setItem('user', { ...user, userId: respons })
        setUserName('');
        history('/games-list')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeLanguage = (value) => {
    setSelectedValue(value)
  }

  return (
    <div className="main-conainer">
      <div className="login-page">
        <div className="form">
          <input type="text" onChange={(e) => setUserName(e.target.value)} placeholder="Name" />
          <div className="py-2">
            <p className="text-left font-weight-bold">Select Language</p>
            <Select options={options} value={selectedValue} onChange={handleChangeLanguage} />
          </div>
          <button onClick={handleLogin}>create/login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
