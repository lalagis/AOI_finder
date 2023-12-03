import { defineStore } from 'pinia'
import type { FeatureCollection } from 'geojson'

export const useLayersStore = defineStore('layers', () => {
  // geojson typed sources
  const sources = $ref<FeatureCollection[]>([])
  // computed from sources
  const points = $computed(() => sources.filter(source => source.features[0].geometry.type === 'Point'))
  const polygons = $computed(() => sources.filter(source => source.features[0].geometry.type === 'Polygon'))

  return $$({
    sources,

    points,
    polygons,
  })
})
