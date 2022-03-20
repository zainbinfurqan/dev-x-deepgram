export const localStorageMethods = {
    setItem: async (key, value) => {
        try {
            await localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error)
        }
    },
    getItem: async (key) => {
        try {
            return await JSON.parse(localStorage.getItem(key));
        } catch (error) {
            console.log(error)
        }
    },
    removeItem: async (key) => {
        try {
            await localStorage.removeItem(key)
        } catch (error) {
            console.log(error)
        }
    },
    clearAll: async (key) => {
        try {
            await localStorage.clearAll()
        } catch (error) {
            console.log(error)
        }
    },
}