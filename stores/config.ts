import type { MapboxComponentOptions } from 'nuxt-mapbox'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // use cookie to store baidu map ak
  const appKey = $(useCookie('appKey', {
    default: () => '',
  }))

  // use cookie to store basemap style(light/dark)
  const basemapStyle = $(useCookie<'light' | 'dark'>('basemapStyle', {
    default: () => 'light',
  }))
  const lightUrl = $ref('mapbox://styles/cirnoqvq/cliip6ot2005e01qp0axh94g8')
  const darkUrl = $ref('mapbox://styles/cirnoqvq/clpan5sjy005d01p94bxtguqj')

  // some options for mapbox
  const mapboxOptions = $computed<MapboxComponentOptions>(() => ({
    style: basemapStyle === 'light' ? lightUrl : darkUrl,
    center: [113.931, 22.539],
    zoom: 16,
  }))

  return $$({
    appKey,
    basemapStyle,
    mapboxOptions,
  })
})
