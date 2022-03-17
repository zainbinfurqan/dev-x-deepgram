import { firebaseInstance } from '../configuration/firebase'
const db = firebaseInstance.firestore()
export const firbaseMethods = {
  createUser: async (data) => {
    const response = await db.collection('users').add({
      ...data
    });
    return response.id
  },
  createRoom: async (data) => {
    const response = await db.collection('rooms').add({
      ...data
    });
    return response.id
  },
  getRoomes: async () => {
    const response = await db.collection('rooms').get();
    return response
  },
  setTicTac: async (id, data) => {
    const response = await db.collection('game').doc(id).update(data);
    const res = await firbaseMethods.getTicTacData(id)
    return res
  },
  getRoomByRoomId: async (id) => {
    const response = await db.collection('rooms').doc(id);
    const res = await response.get()
    return res
  },
  getTicTacData: async (id) => {
    const response = await db.collection('rooms').doc(id);
    const res = await response.get()
    return res
  }
};
