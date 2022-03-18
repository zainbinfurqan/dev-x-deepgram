import { firebaseInstance } from '../configuration/firebase'
const db = firebaseInstance.firestore()
export const firbaseMethods = {
  //---------
  createUser: async (data) => {
    const response = await db.collection('users').add({
      ...data
    });
    return response.id
  },
  //---------
  createRoom: async (data) => {
    const response = await db.collection('rooms').add({
      ...data
    });
    return response.id
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
  // getRealTimeRooms: async () => {
  //   const responseContent = []
  //   const response = db.collection('rooms')
  //   const a = response.onSnapshot(querySnapshot => {
  //     const responseContent = querySnapshot.docs.map(doc => doc.data())
  //     console.log(responseContent)
  //     return responseContent
  //   }, err => {
  //     return err
  //   });
  //   return a
  // },
  //---------
  setTicTac: async (id, data) => {
    const response = await db.collection('game').doc(id).update(data);
    const res = await firbaseMethods.getTicTacData(id)
    return res
  },
  //---------
  getTicTacData: async (id) => {
    const response = await db.collection('rooms').doc(id);
    const res = await response.get()
    return res
  }
};
