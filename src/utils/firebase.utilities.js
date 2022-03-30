import { firebaseInstance } from '../configuration/firebase'
import firebase from "firebase/compat/app";
const db = firebaseInstance.firestore()
export const firbaseMethods = {
  //---------
  createUser: async (data) => {
    try {
      const response = await db.collection('users').add({
        ...data
      });
      return response.id
    } catch (error) {
      return error
    }
  },
  //---------
  createRoom: async (data, gameData) => {
    try {
      const response = await db.collection('rooms').add({
        ...data,
      });
      const gameResponse = await firbaseMethods.createGame(response.id, gameData)
      await db.collection('rooms').doc(response.id).update({
        gameId: gameResponse
      });
      const roomData = await db.collection('rooms').doc(response.id).get();
      return roomData.data()
    } catch (error) {
      console.log(error)
    }
  },
  createRoomForVoiceTheAlphabateGame: async (data, gameData) => {
    try {
      const response = await db.collection('rooms').add({
        ...data,
      });
      const gameResponse = await firbaseMethods.createGameForVoiceTheAlphabate(response.id, gameData)
      await db.collection('rooms').doc(response.id).update({
        gameId: gameResponse
      });
      const roomData = await db.collection('rooms').doc(response.id).get();
      return roomData.data()
    } catch (error) {
      console.log(error)
    }
  },
  //---------
  getRooms: async () => {
    const response = await db.collection('rooms').get();
    const responseContent = response.docs.map(doc => doc.data())
    return responseContent
  },
  //---------
  getRoomByRoomId: async (id) => {
    const response = db.collection('rooms').doc(id);
    const res = await response.get()
    const responseContent = res.docs.map(doc => doc.data())
    return responseContent
  },
  //---------
  setTicTac: async (id, data) => {
    console.log(data)
    await db.collection('tictactoe-game').doc(id).update(data);
    const res = await firbaseMethods.getTicTacData(id)
    return res
  },
  //---------
  getTicTacData: async (id) => {
    const response = await db.collection('rooms').doc(id);
    const res = await response.get()
    return res
  },
  createGame: async (roomId, game) => {
    try {
      const response = await db.collection('tictactoe-game').add({
        roomId,
        ...game
      });
      return response.id
    } catch (error) {
      console.log(error)
    }
  },
  createGameForVoiceTheAlphabate: async (roomId, game) => {
    try {
      const response = await db.collection('voice-the-alphabate-game').add({
        roomId,
        ...game
      });
      return response.id
    } catch (error) {
      console.log(error)
    }
  },
  joinGame: async (password, data, userId) => {
    try {
      var singleRoom = db.collection('rooms').doc(data.id);
      await singleRoom.update({
        // users: admin.firestore.FieldValue.arrayUnion('greater_virginia')
        users: firebase.firestore.FieldValue.arrayUnion(userId)
      });
      await db.collection('rooms').doc(data.id).get()
      const response = await db.collection('rooms').doc(data.id).get()
      if (response.data() && Object.keys(response.data()).length > 0) {
        if (password === response.data().roomPassword) {
          try {
            const getGameDataById = await (await db.collection('tictactoe-game').doc(data.gameId).get()).data()
            getGameDataById[userId] = 'circle'
            await db.collection('tictactoe-game').doc(data.gameId).update({
              ...getGameDataById,
            })
            const updateGameToAddUserIdInArray = db.collection('tictactoe-game').doc(data.gameId)
            updateGameToAddUserIdInArray.update({
              users: firebase.firestore.FieldValue.arrayUnion(userId)
            })
          } catch (error) {
            console.log(error)
          }
          return response.data()
        } else {
          return false
        }
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
    }
  },

  getGame: async (id) => {
    const response = await db.collection('tictactoe-game').doc(id).get()
    if (response.data() && Object.keys(response.data()).length > 0) {
      return response.data()
    }
  },
  resetGame: async (id, data) => {
    await db.collection('tictactoe-game').doc(id).update(data);
    return await firbaseMethods.getGame(id)
  }
};
