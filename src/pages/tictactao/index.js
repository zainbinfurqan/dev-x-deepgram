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
import "./style.css";
const db = firebaseInstance.firestore()

function TictacTao(props) {
  const [user, setUser] = useState({})
  const [otherUser, setOtherUser] = useState('')
  const [game, setGame] = useState({})
  const [gameMap, setGameMap] = useState([])
  const [userTurn, setUserTurn] = useState(null)
  useEffect(async () => {
    const user = await localStorageMethods.getItem('user')
    setUser(user)
    await fetchGame()
  }, [])

  const fetchGame = async () => {
    // console.log('fetchGame')
    const gameData = await localStorageMethods.getItem('game')
    const toGetOtherUserId = await db.collection('games').doc(gameData.gameId).get()
    setOtherUser(toGetOtherUserId.data().users.filter(item => item != user.userId)[0])
    const response = db.collection('games').doc(gameData.gameId)
    response.onSnapshot(querySnapshot => {
      const gameMapUser = {}
      console.log(querySnapshot)
      setUserTurn(querySnapshot.data().userTurn)
      querySnapshot.data().ticTacData.map(item => {
        if (item.user == user.userId) {
          if (gameMapUser.hasOwnProperty(user.userId)) {
            gameMapUser[user.userId].push(item.ticPosition)
          } else {
            gameMapUser[user.userId] = [item.ticPosition]
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
      return err
    })
  }

  useEffect(async () => {
    // console.log("get media")
    // console.log("userTurn", userTurn)
    // console.log("userTurn", user.userId)
    // console.log(mediaRecorder)
    if (userTurn == user.userId) {
      const { audioNote, mediaRecorder, socket, socketOnOpen, socketOnMessage } = await audioGet.getMediaAudio()
      if (mediaRecorder != null) {
        console.log('start')
        console.log(socket)
        socket.onopen = () => {
          mediaRecorder.addEventListener("dataavailable", async (event) => {
            if (event.data.size > 0 && socket.readyState == 1) {
              socket.send(event.data);
              // console.log(event.data)
            }
          });
          mediaRecorder.start();
        };
        // mediaRecorder.start(500)
      }
      // console.log('aa')
      //   const result = await audioGet.getMediaAudio()
      //   console.log(result)
    } else {
      //   // mediaRecorder.stop();
    }
    // audioGet.getMediaAudio()
  }, [userTurn])

  const handleCheckTic = async (ticBox) => {
    //----------------
    let isGameFinish = false
    const gameMapUser = {}
    const gameData = await localStorageMethods.getItem('game')
    if (game.ticTacData.findIndex(itm => itm.ticPosition == ticBox) < 0) {
      const tic = { user: user.userId, ticPosition: ticBox }
      game.ticTacData.push(tic)
      game.userTurn = otherUser
      const data = {
        ...game
      }
      await firbaseMethods.setTicTac(gameData.gameId, data)
      //-------
      const response = await db.collection('games').doc(gameData.gameId).get()
      await response.data().ticTacData.map(item => {
        if (item.user == user.userId) {
          if (gameMapUser.hasOwnProperty(user.userId)) {
            gameMapUser[user.userId].push(item.ticPosition)
          } else {
            gameMapUser[user.userId] = [item.ticPosition]
          }
        } else {
          if (gameMapUser.hasOwnProperty(item.user)) {
            gameMapUser[item.user].push(item.ticPosition)
          } else {
            gameMapUser[item.user] = [item.ticPosition]
          }
        }
      });
      //-----
      if (gameMapUser.hasOwnProperty(user.userId) && gameMapUser[user.userId].length > 2) {
        for (let i = 0; i < constants.tictactaoPairs.length; i++) {
          isGameFinish = gameMapUser.hasOwnProperty(user.userId) && constants.tictactaoPairs[i].every(element => {
            return gameMapUser[user.userId].includes(element);
          });
          console.log("isGameFinish for=>", isGameFinish)
          if (isGameFinish) { break }
        }
      }
      // console.log(isGameFinish)
      if (isGameFinish == true) {
        game.isWin = true
        // game.wins.push(user.userId)
        const gameData_ = await localStorageMethods.getItem('game');
        const updateGameObjectToAddWinner = db.collection('games').doc(gameData_.gameId)
        // updateGameObjectToAddWinner.update({
        //   users: firebase.firestore.FieldValue.arrayUnion(user.userId)
        // })
        const data = {
          ...game
        }
        await firbaseMethods.setTicTac(gameData.gameId, data)
        console.log('user' + ' ' + user.userId + ' ' + 'win')
      }
    } else {

    }

    // setGameMap(gameMapUser)

    //----------------
    // console.log(ticBox)
    // console.log(game.ticTacData)
    // console.log(game.ticTacData.findIndex(itm => itm.ticPosition == ticBox))
    // if (game.ticTacData.findIndex(itm => itm.ticPosition == ticBox) < 0) {
    // const tic = { user: user.userId, ticPosition: ticBox }
    // game.ticTacData.push(tic)
    // game.userTurn = otherUser
    // console.log(gameMapUser)
    // console.log(gameMapUser.hasOwnProperty(user.userId))
    // console.log(gameMap[user.userId].length)
    // console.log(gameMapUser.hasOwnProperty(user.userId) && gameMapUser)
    // console.log(gameMapUser.hasOwnProperty(user.userId) && gameMapUser[user.userId])

    // } else {
    //   console.log('error')
    // }
  }

  const handleStartNewGame = async () => {
    const data = { ...game }
    data.isWin = false;
    data.ticTacData = []
    const gameData = await localStorageMethods.getItem('game')
    const response = await firbaseMethods.resetGame(gameData.gameId, data)
    setGame(response)
  }

  return (
    <div>
      {Object.keys(game).length > 0 && game.userTurn != user.userId && <WaitForYourTurn />}
      {Object.keys(game).length > 0 && game.isWin && <GameWinner user={game.wins}
        handleStartNewGame={handleStartNewGame} />}
      <h2 className='text-white text-center p-5'>Tic Tac Tao</h2>
      <div className="game-main-container">
        <div className="row-1 d-flex">
          <div className="tac-box" id="one:one" onClick={() => handleCheckTic('one one')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('one one') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('one one') && Object.keys(game).length > 0 && game[otherUser]}
            />
            {/* <p>one:one</p> */}
          </div>
          <div className="tac-box" id="one:two" onClick={() => handleCheckTic('one two')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('one two') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('one two') && Object.keys(game).length > 0 && game[otherUser]}
            />
            {/* <p>one:two</p> */}
          </div>
          <div className="tac-box-last" id="one:three" onClick={() => handleCheckTic('one three')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('one three') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('one three') && Object.keys(game).length > 0 && game[otherUser]}
            />
            {/* <p>one:three</p> */}
          </div>
        </div>
        <div className="row-2 d-flex">
          <div className="tac-box" id="two:one" onClick={() => handleCheckTic('two:one')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('two:one') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('two:one') && Object.keys(game).length > 0 && game[otherUser]}
            />
            {/* <p>two:one</p> */}
          </div>
          <div className="tac-box" id="two:two" onClick={() => handleCheckTic('two two')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('two two') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('two two') && Object.keys(game).length > 0 && game[otherUser]}
            />
            {/* <p>two:two</p> */}
          </div>
          <div className="tac-box-last" id="two:three" onClick={() => handleCheckTic('two three')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('two three') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('two three') && Object.keys(game).length > 0 && game[otherUser]}
            />
            {/* <p>two:three</p> */}
          </div>
        </div>
        <div className="row-3 d-flex">
          <div className="tac-box" id="three:one" onClick={() => handleCheckTic('three one')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('three one') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('three one') && Object.keys(game).length > 0 && game[otherUser]}
            />
            {/* <p>three:one</p> */}
          </div>
          <div className="tac-box" id="three:two" onClick={() => handleCheckTic('three two')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('three two') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('three two') && Object.keys(game).length > 0 && game[otherUser]}
            />
            {/* <p>three:two</p> */}
          </div>
          <div className="tac-box-last" id="three:three" onClick={() => handleCheckTic('three three')}>
            <TicTacSign ticSign={Object.keys(gameMap).length > 0 &&
              gameMap.hasOwnProperty(user.userId) && gameMap[user.userId].includes('three three') &&
              Object.keys(game).length > 0 ? game[user.userId]
              : Object.keys(gameMap).length > 0 && gameMap.hasOwnProperty(otherUser) && gameMap[otherUser].includes('three three') && Object.keys(game).length > 0 && game[otherUser]}
            />
            {/* <p>three:three</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TictacTao;
