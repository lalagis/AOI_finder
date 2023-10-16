import type { MapboxComponentOptions } from 'nuxt-mapbox'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const appKey = $(useCookie('appKey', {
    default: () => '',
  }))

  const mapboxOptions = $ref<MapboxComponentOptions>({
    style: 'mapbox://styles/cirnoqvq/cliip6ot2005e01qp0axh94g8',
    center: [113.931, 22.539],
    zoom: 16,
  })

  return $$({
    appKey,
    mapboxOptions,
  })
})
