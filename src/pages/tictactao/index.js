import React, { useEffect, useState } from "react";
import GameWinner from "../../components/gamewin";
import TicTacSign from "../../components/tic&tac_sign";
import WaitForYourTurn from "../../components/waitforyourturn";
import { firebaseInstance } from "../../configuration/firebase";
import { constants } from "../../constants";
import { audioGet } from "../../utils/audioget.utilities";
import { firbaseMethods } from "../../utils/firebase.utilities";
import { localStorageMethods } from "../../utils/localstorage.utilities";
import firebase from "firebase/compat/app";
import translate from "translate";
import "./style.css";

const db = firebaseInstance.firestore()

function TictacTao(props) {

  const [user, setUser] = useState({})
  const [otherUser, setOtherUser] = useState('')
  const [game, setGame] = useState({})
  const [gameMap, setGameMap] = useState({})

  useEffect(async () => {
    const user = await localStorageMethods.getItem('user')
    setUser(user)
    await fetchGame()
  }, [])

  const fetchGame = async () => {
    const user_ = await localStorageMethods.getItem('user')
    const gameData = await localStorageMethods.getItem('tictactoe-game')
    const response = db.collection('tictactoe-game').doc(gameData.gameId)
    response.onSnapshot(async querySnapshot => {
      const gameMapUser = {}
      querySnapshot.data().ticTacData.map(item => {
        if (querySnapshot.data().users && querySnapshot.data().users.length > 0) {
          const otherUserId = querySnapshot.data().users.filter(item => item != user_.userId)
          if (otherUserId.length > 0) { setOtherUser(otherUserId[0]) }
        }
        if (item.user == user_.userId) {
          if (gameMapUser.hasOwnProperty(user_.userId)) {
            gameMapUser[user_.userId].push(item.ticPosition)
          } else {
            gameMapUser[user_.userId] = [item.ticPosition]
          }
        } else {
          if (gameMapUser.hasOwnProperty(item.user)) {
            gameMapUser[item.user].push(item.ticPosition)
          } else {
            gameMapUser[item.user] = [item.ticPosition]
          }
        }
      })
      setGameMap(gameMapUser)
      setGame({ ...querySnapshot.data() })
    }, err => {
      console.log(err)
      return err
    })
  }

  const handleCheckIfSelectedTicAlreadyExsist = async (userSelectedTic) => {
    const getGameResponseFromLocalHost = await localStorageMethods.getItem('tictactoe-game')
    const getGameResponseFromFirebase = await db.collection('tictactoe-game').doc(getGameResponseFromLocalHost.gameId).get()
    let game = await getGameResponseFromFirebase.data();
    if (game.length > 0 && game.ticTacData.length > 0) {
      if (game.ticTacData.findIndex(itm => itm.ticPosition == userSelectedTic) < 0) {
        await handleCheckTic(game, userSelectedTic)
      } else {

      }
    } else {
      await handleCheckTic(game, userSelectedTic)
    }
  }

  const handleCheckTic = async (game, userSelectedTic) => {
    try {
      //----------------
      const userFromLocalStorage = await localStorageMethods.getItem('user')
      const createGameUserMapping = {}
      const tic = { user: user.userId, ticPosition: userSelectedTic }
      const getGameResponseFromLocalHost = await localStorageMethods.getItem('tictactoe-game')
      // const getGameResponseFromFirebase = db.collection('tictactoe-game').doc(getGameResponseFromLocalHost.gameId).get()

      // let game = await getGameResponseFromFirebase.data();
      let isGameFinish = false
      const otherUserId = game.users.filter(item => item != userFromLocalStorage.userId)
      game.ticTacData.push(tic)
      game.userTurn = otherUserId[0]

      await firbaseMethods.setTicTac(getGameResponseFromLocalHost.gameId, game)
      //-------
      const response = await db.collection('tictactoe-game').doc(getGameResponseFromLocalHost.gameId).get()

      await response.data().ticTacData.map(item => {

        if (item.user == user.userId) {
          if (createGameUserMapping.hasOwnProperty(user.userId)) {
            createGameUserMapping[user.userId].push(item.ticPosition)
          } else {
            createGameUserMapping[user.userId] = [item.ticPosition]
          }
        } else {
          if (createGameUserMapping.hasOwnProperty(item.user)) {
            createGameUserMapping[item.user].push(item.ticPosition)
          } else {
            createGameUserMapping[item.user] = [item.ticPosition]
          }
        }
      });
      //-----
      if (createGameUserMapping.hasOwnProperty(user.userId) && createGameUserMapping[user.userId].length > 2) {
        for (let i = 0; i < constants.tictactaoPairs.length; i++) {
          isGameFinish = createGameUserMapping.hasOwnProperty(user.userId) && constants.tictactaoPairs[i].every(element => {
            return createGameUserMapping[user.userId].includes(element);
          });
          if (isGameFinish) { break }
        }
      }

      if (isGameFinish == true) {
        game.isWin = true
        game.wins.push(user.userId)
        game.userTurn = otherUser
        await firbaseMethods.setTicTac(getGameResponseFromLocalHost.gameId, game)
      }
    }

    catch (error) {
      console.log(error)
    }
  }

  const handleStartNewGame = async () => {
    const data = { ...game }
    data.isWin = false;
    data.ticTacData = []
    const gameData = await localStorageMethods.getItem('tictactoe-game')
    const response = await firbaseMethods.resetGame(gameData.gameId, data)
    setGame(response)
  }

  useEffect(async () => {
    if (game.userTurn == user.userId) {
      let mediaRecorder = null;
      await window.navigator.mediaDevices.getUserMedia({ audio: true }).then((res) => {
        mediaRecorder = new MediaRecorder(res, {
          audio: true,
        });
      })
      let socket = new WebSocket("wss://api.deepgram.com/v1/listen", [
        "token",
        "06e1b33e25def49e8c87daa5940991afdc34b0b5",
      ]);
      socket.onopen = () => {
        mediaRecorder.addEventListener("dataavailable", async (event) => {
          if (event.data.size > 0 && socket.readyState == 1) {
            socket.send(event.data);
          }
        });
        mediaRecorder.start(500);
      };
      socket.onmessage = async (message) => {
        const received = JSON.parse(message.data);
        const transcript = received.channel.alternatives[0].transcript;
        if (transcript && received.is_final) {
          const convertedLanguage = await translate(
            transcript,
            'en'
          );
          handleCheckIfSelectedTicAlreadyExsist(convertedLanguage)
          mediaRecorder.stop();
        }
      };
    }

  }, [game.userTurn])

  return (
    <div className="tictoctoe-game-main-container">
      {Object.keys(game).length > 0 && game.userTurn != user.userId && <WaitForYourTurn />}
      {Object.keys(game).length > 0 && game.isWin && <GameWinner user={game.wins}
        handleStartNewGame={handleStartNewGame} />}
      <h2 className='text-white text-center p-5' style={{
        fontWeight: 'bolder',
        textAlign: 'center',
        padding: '16px',
        fontSize: '57px',
        textShadow: '2px 2px 5px #0c0b0b',
      }}>Tic Tac Toe</h2>
      <div className="tictoctoe-game-grid">
        <div className="row-1 d-flex">
          <div className="tac-box" id="one one" onClick={() => handleCheckIfSelectedTicAlreadyExsist('one one')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('one one') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('one one') && Object.keys(game).length > 0 && game[otherUser]}
            />
          </div>
          <div className="tac-box" id="one two" onClick={() => handleCheckIfSelectedTicAlreadyExsist('one two')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('one two') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('one two') && Object.keys(game).length > 0 && game[otherUser]}
            />
          </div>
          <div className="tac-box-last" id="one three" onClick={() => handleCheckIfSelectedTicAlreadyExsist('one three')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('one three') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('one three') && Object.keys(game).length > 0 && game[otherUser]}
            />
          </div>
        </div>
        <div className="row-2 d-flex">
          <div className="tac-box" id="two one" onClick={() => handleCheckIfSelectedTicAlreadyExsist('two one')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('two one') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('two one') && Object.keys(game).length > 0 && game[otherUser]}
            />
          </div>
          <div className="tac-box" id="two two" onClick={() => handleCheckIfSelectedTicAlreadyExsist('two two')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('two two') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('two two') && Object.keys(game).length > 0 && game[otherUser]}
            />
          </div>
          <div className="tac-box-last" id="two three" onClick={() => handleCheckIfSelectedTicAlreadyExsist('two three')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('two three') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('two three') && Object.keys(game).length > 0 && game[otherUser]}
            />
          </div>
        </div>
        <div className="row-3 d-flex">
          <div className="tac-box" id="three one" onClick={() => handleCheckIfSelectedTicAlreadyExsist('three one')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('three one') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('three one') && Object.keys(game).length > 0 && game[otherUser]}
            />
          </div>
          <div className="tac-box" id="three two" onClick={() => handleCheckIfSelectedTicAlreadyExsist('three two')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('three two') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('three two') && Object.keys(game).length > 0 && game[otherUser]}
            />
          </div>
          <div className="tac-box-last" id="three three" onClick={() => handleCheckIfSelectedTicAlreadyExsist('three three')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('three three') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('three three') && Object.keys(game).length > 0 && game[otherUser]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TictacTao;
