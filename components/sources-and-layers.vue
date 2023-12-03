<!-- manage mapbox sources(geojson) and layers(render) -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'

// get sources from store
const layers = useLayersStore()
const { sources, points, polygons } = $(storeToRefs(layers))
</script>

<template>
  <!-- input current sources into mapbox source -->
  <mapbox-source
    v-for="item in sources"
    :key="`${item.features[0].properties!.uid}`"
    :source-id="`${item.features[0].properties!.uid}-source`"
    :source="{
      type: 'geojson',
      data: item,
    }"
  />

  <!-- render polygons layers -->
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
        'fill-opacity': 0.5,
      },
    }"
  />

  <!-- render points layers -->
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
