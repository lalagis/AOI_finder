import { defineStore } from 'pinia'
import type { FeatureCollection } from 'geojson'

export const useLayersStore = defineStore('layers', () => {
  const config = useConfigStore()
  const sources = $ref<FeatureCollection[]>([])
  const points = $computed(() => sources.filter(source => source.features[0].geometry.type === 'Point'))
  const polygons = $computed(() => sources.filter(source => source.features[0].geometry.type === 'Polygon'))

  watchEffect(() => {
    if (sources.length) {
      const type = sources[0].features[0].geometry.type
      if (type === 'Point')
        config.mapboxOptions.center = sources[0].features[0].geometry.coordinates as [number, number]

      else if (type === 'Polygon')
        config.mapboxOptions.center = sources[0].features[0].geometry.coordinates[0][0] as [number, number]
    }
  })

  return $$({
    sources,

    points,
    polygons,
  })
})
