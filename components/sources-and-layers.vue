<script setup lang="ts">
import { storeToRefs } from 'pinia'

const layers = useLayersStore()
const { sources, points, polygons } = $(storeToRefs(layers))
</script>

<template>
  <mapbox-source
    v-for="item in sources"
    :key="`${item.features[0].properties!.uid}`"
    :source-id="`source-${item.features[0].properties!.uid}}-source`"
    :source="{
      type: 'geojson',
      data: item,
    }"
  />

  <mapbox-layer
    v-for="item in polygons"
    :key="`${item.features[0].properties!.uid}`"
    :layer="{
      id: `${item.features[0].properties!.uid}-layer`,
      source: `${item.features[0].properties!.uid}-source`,
      type: 'fill',
      layout: {},
      paint: {
        'fill-color': '#F7FB8E',
        'fill-outline-color': '#0062CA',
      },
    }"
  />

  <mapbox-layer
    v-for="item in points"
    :key="`${item.features[0].properties!.uid}`"
    :layer="{
      id: `${item.features[0].properties!.uid}-layer`,
      source: `${item.features[0].properties!.uid}-source`,
      type: 'circle',
      layout: {},
      paint: {
        'circle-color': '#0062CA',
        'circle-radius': 6,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    }"
  />
</template>
