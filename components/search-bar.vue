<script setup lang="ts">
// use stores
const config = useConfigStore()
const layers = useLayersStore()

// is searching
let searching = $ref(false)
// input values
const region = $ref('')
let query = $ref('')

// when click search button
async function onClickSearch() {
  // switch searching status, to show spinner icon
  searching = true

  // get pois data from our api
  const { data } = $(await useFetch('/api/suggestions', {
    method: 'get',
    params: { region, query, appKey: config.appKey },
  }))
  // for each poi
  data.forEach(async (item: POI) => {
    // try to search aoi
    const { data: geojson } = $(await useFetch('/api/aoi', {
      method: 'get',
      params: { uid: item.uid, lng: item.location.lng, lat: item.location.lat },
    }))
    // geojson will be returned as usual regardless of whether aoi exists or not
    if (geojson) {
      // @ts-expect-error rewrite name
      geojson.name = item.name
      geojson.features[0].properties = {
        ...geojson.features[0].properties,
        // @ts-expect-error properties name
        name: item.name,
        location: item.location,
        province: item.province,
        district: item.district,
        city: item.city,
        adcode: item.adcode,
        address: item.address,
        business: item.business,
        cityid: item.cityid,
        tag: item.tag,
      }
      layers.sources.push(geojson)
    }
  })

  // clean and reset
  query = ''
  searching = false
}
</script>

<template>
  <!-- position -->
  <div class="fixed inset-x-0 z-10">
    <!-- container -->
    <div class="w-[30vw] max-w-[540px] drop-shadow-md bg-white mt-30 rounded-4 mx-auto relative flex flex-row items-center">
      <!-- main input spaces -->
      <div class="flex-1 grid grid-cols-4 divide-x h-16">
        <!-- left region panel -->
        <div class="col-span-1 h-full rounded-l-4 flex items-center">
          <input
            v-model="region"
            type="text"
            class="px-5 w-full py-2 focus:outline-none text-xl placeholder:text-sm text-center"
            placeholder="区域(如深圳市)"
          >
        </div>
        <!-- right keywords panel -->
        <div class="col-span-3 h-full rounded-r-4 flex items-center">
          <input
            v-model="query"
            type="text"
            class="px-5 w-full py-2 focus:outline-none text-xl placeholder:text-sm"
            placeholder="目标AOI(如荔香公园)"
          >
        </div>
      </div>
      <!-- search-button icons(search/loading) -->
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
