import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const appKey = $ref('oR61jVhhckCpgE7HjUS6ihOcHafefeId')
  // const secretKey = $ref('')

  return $$({
    appKey,
    // secretKey,
  })
})
