import { defineStore } from 'pinia'
import type { FeatureCollection } from 'geojson'

export const useLayersStore = defineStore('layers', () => {
  const sources = $ref<FeatureCollection[]>([])
  const points = $computed(() => sources.filter(source => source.features[0].geometry.type === 'Point'))
  const polygons = $computed(() => sources.filter(source => source.features[0].geometry.type === 'Polygon'))

  return $$({
    sources,

    points,
    polygons,
  })
})
