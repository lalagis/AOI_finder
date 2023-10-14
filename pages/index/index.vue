<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <div class="w-screen h-screen m-0 relative">
    <mapbox-map
      map-id="base"
      class="absolute inset-0"
      :options="{
        style: config.public.MAPBOX_STYLE,
        center: [113.931, 22.539],
        zoom: 16,
      }"
    >
      <div />
    </mapbox-map>
  </div>
</template>
