import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import TictacTao from "./pages/tictactao";
import Login from "./pages/login";
import Home from "./pages/home";
// import { Deepgram } from "@deepgram/sdk";

function App() {
  // useEffect(() => {
  //   navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  //     if (!MediaRecorder.isTypeSupported("audio/webm"))
  //       return alert("Browser not supported");
  //     const mediaRecorder = new MediaRecorder(stream, {
  //       mimeType: "audio/webm",
  //     });

  //     // Open connection to Deepgram
  //     const socket = new WebSocket("wss://api.deepgram.com/v1/listen", [
  //       "token",
  //       "0f23ae2ad1b21bcd93fd898f68bf3fb4d318e32a",
  //     ]);

  //     // Listen for audio data coming from microphone and send it to Deepgram
  //     socket.onopen = () => {
  //       mediaRecorder.addEventListener("dataavailable", async (event) => {
  //         if (event.data.size > 0 && socket.readyState == 1) {
  //           socket.send(event.data);
  //         }
  //       });
  //       mediaRecorder.start(1000);
  //     };

  //     // Put the transcript onto the screen in the #captions element
  //     socket.onmessage = (message) => {
  //       const received = JSON.parse(message.data);
  //       const transcript = received.channel.alternatives[0].transcript;
  //       if (transcript && received.is_final) {
  //         console.log("transcript=>", transcript);
  //         // document.querySelector("#captions").textContent += transcript + " ";
  //       }
  //     };

  //     socket.onclose = () => {
  //       console.log({ event: "onclose" });
  //     };

  //     socket.onerror = (error) => {
  //       console.log({ event: "onerror", error });
  //     };
  //   });
  //   // window.navigator.mediaDevices.getUserMedia({ audio: true }).then((res) => {
  //   //   const mediaRecorder = new MediaRecorder(res, {
  //   //     audio: true,
  //   //   });
  //   //   const socket = new WebSocket("wss://api.deepgram.com/v1/listen", [
  //   //     "token",
  //   //     "0f23ae2ad1b21bcd93fd898f68bf3fb4d318e32a",
  //   //   ]);

  //   //   socket.onopen = () => {
  //   //     mediaRecorder.addEventListener("dataavailable", async (event) => {
  //   //       if (event.data.size > 0 && socket.readyState == 1) {
  //   //         socket.send(event.data);
  //   //       }
  //   //     });
  //   //     mediaRecorder.start(1000);
  //   //   };
  //   // });
  // }, []);
  // const deepgram = new Deepgram("2656ee6b-9fa4-4080-8c87-e27b7cd7d0d1");

  return (
    // <TictacTao />
    // <Login />
    <Home />
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
