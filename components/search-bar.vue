<script setup lang="ts">
const config = useConfigStore()
const layers = useLayersStore()
let searching = $ref(false)

const region = $ref('')
let query = $ref('')

async function onClickSearch() {
  searching = true

  const { data } = $(await useFetch('/api/suggestions', {
    method: 'get',
    params: { region, query, appKey: config.appKey },
  }))
  data.forEach(async (item: POI) => {
    const { data: geojson } = $(await useFetch('/api/aoi', {
      method: 'get',
      params: { uid: item.uid, lng: item.location.lng, lat: item.location.lat },
    }))
    if (geojson)
      layers.sources.push(geojson)
  })

  query = ''
  searching = false
}
</script>

<template>
  <div class="fixed inset-x-0 z-10">
    <div class="w-[30vw] max-w-[540px] drop-shadow-md bg-white mt-30 rounded-4 mx-auto relative flex flex-row items-center">
      <div class="flex-1 grid grid-cols-4 divide-x h-16">
        <div class="col-span-1 h-full rounded-l-4 flex items-center">
          <input
            v-model="region"
            type="text"
            class="px-5 w-full py-2 focus:outline-none text-xl placeholder:text-sm text-center"
            placeholder="区域(如深圳市)"
          >
        </div>
        <div class="col-span-3 h-full rounded-r-4 flex items-center">
          <input
            v-model="query"
            type="text"
            class="px-5 w-full py-2 focus:outline-none text-xl placeholder:text-sm"
            placeholder="目标AOI(如荔香公园)"
          >
        </div>
      </div>
      <div
        v-auto-animate
        class="rounded-r-4 absolute right-0 h-16 w-16 flex items-center bg-emerald justify-center cursor-pointer transition-all duration-300 hover:bg-green active:scale-105"
        @click="onClickSearch"
      >
        <div v-if="!searching" class="i-fluent-emoji-flat:magnifying-glass-tilted-right text-3xl" />
        <div v-else class="i-svg-spinners:pulse text-3xl" />
      </div>
    </div>
  </div>
</template>
