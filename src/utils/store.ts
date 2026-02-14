import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Drop-in replacement for react-native-simple-store,
 * backed by @react-native-async-storage/async-storage.
 */
const store = {
  async get(key: string) {
    const value = await AsyncStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },

  async update(key: string, value: any) {
    const existing = await store.get(key)
    const merged = existing && typeof existing === 'object' && typeof value === 'object'
      ? { ...existing, ...value }
      : value
    await AsyncStorage.setItem(key, JSON.stringify(merged))
  },

  async delete(key: string) {
    await AsyncStorage.removeItem(key)
  },

  async push(key: string, value: any) {
    const existing = await store.get(key)
    const arr = Array.isArray(existing) ? [...existing, value] : [value]
    await AsyncStorage.setItem(key, JSON.stringify(arr))
  },
}

export default store
