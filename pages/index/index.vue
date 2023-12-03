<script setup lang="ts">
const config = useConfigStore()
</script>

<template>
  <!-- container -->
  <div class="w-screen h-screen m-0 relative">
    <!-- components->search-bar -->
    <search-bar />
    <!-- components->layers-panel -->
    <layers-panel />

    <!-- basemap-mapbox -->
    <mapbox-map
      map-id="base"
      class="absolute inset-0"
      :options="config.mapboxOptions"
    >
      <!-- components->sources-and-layers  -->
      <sources-and-layers />
    </mapbox-map>
  </div>
</template>
