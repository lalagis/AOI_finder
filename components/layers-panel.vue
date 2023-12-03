<script setup lang="ts">
import type { FeatureCollection } from 'geojson'
import { storeToRefs } from 'pinia'

// is settings open
const isSettingsOpen = $ref(false)

// tutorial text(show when no layer)
const tutorial = $ref([
  '暂无图层，以下是教程',
  '1. 在设置中配置百度地图ak',
  '2. 在搜索框输入区域与目标',
  '3. 在该区域查看关联的AOI图层',
  '4. 按格式选择数据下载',
])

// get sources from store
const layers = useLayersStore()
const { sources } = $(storeToRefs(layers))

// clear all sources
function onClickRemoveall() {
  layers.sources = []
}

// remove one source
function onClickRemoveItem(index: number) {
  layers.sources = layers.sources.filter((_, i) => i !== index)
}

// camera fly to the center of the source
function flyto(item: FeatureCollection) {
  let lng: number = 113.931
  let lat: number = 22.539
  if (item.features[0].geometry.type === 'Point')
    [lng, lat] = item.features[0].geometry.coordinates

  else if (item.features[0].geometry.type === 'Polygon')
    [lng, lat] = item.features[0].geometry.coordinates[0][0]

  useMapbox('base', (map) => {
    map.flyTo({
      center: [lng, lat],
      zoom: 16,
      // essential: true,
    })
  })
}

// is download modal open
let isDownloadOpen = $ref(false)
// current file to download
let currentFile = $ref<FeatureCollection>()

function onClickDownload(item: FeatureCollection) {
  currentFile = item
  isDownloadOpen = true
}
function onCloseDownload() {
  currentFile = undefined
  isDownloadOpen = false
}
</script>

<template>
  <div class="absolute left-5 bottom-10 bg-white rounded-1 drop-shadow-md pt-2 h-[40vh] w-[230px] z-10 flex flex-col">
    <!-- title and remove all button -->
    <div class="overflow-auto pb-8">
      <div v-if="!!sources.length" class="w-full flex justify-between items-center mb-3">
        <span class="text-sm ml-2">当前图层列表</span>
        <div
          class="flex flex-row gap-x-1 items-center px-2 py-1 bg-emerald w-fit rounded-1 mr-2 cursor-pointer transition-all duration-300 hover:bg-green active:scale-105"
          @click="onClickRemoveall"
        >
          <div class="i-akar-icons:trash-can" />
          <span class="text-sm">全部删除</span>
        </div>
      </div>
      <!-- no layer, show tutorial -->
      <ul v-if="!sources.length" class="text-sm px-3 flex flex-col gap-y-2">
        <li v-for="(item, index) in tutorial" :key="index" class="text-gray-500">
          {{ item }}
        </li>
      </ul>
      <!-- layers -->
      <ul v-else v-auto-animate class="text-sm px-3 flex flex-col gap-y-2">
        <li v-for="(item, index) in sources" :key="item.features[0].properties!.uid" class="flex flex-row items-center">
          <!-- if it is a point -->
          <div v-if="item.features[0].geometry.type === 'Point' " class="i-akar-icons:check-in flex-none" />
          <!-- has aoi -->
          <div v-else class="i-akar-icons:flag flex-none text-emerald" />
          <!-- name -->
          <span class="ml-2 truncate" :class="item.features[0].geometry.type === 'Polygon' && 'text-emerald'">{{ item.features[0].properties!.name }}</span>
          <!-- tools -->
          <div class="flex flex-row items-center gap-x-2 ml-auto">
            <!-- flyto -->
            <div class="i-akar-icons:plane-fill cursor-pointer" @click="flyto(item)" />
            <!-- download -->
            <div class="i-akar-icons:download cursor-pointer" @click="onClickDownload(item)" />
            <!-- remove from layers -->
            <div class="i-akar-icons:trash-can cursor-pointer" @click="onClickRemoveItem(index)" />
          </div>
        </li>
      </ul>
    </div>
    <!-- footer -->
    <div class="w-full flex flex-col items-center mt-auto">
      <!-- copy right -->
      <p class="text-gray text-sm">
        AOI_finder 2023 © lulala
      </p>
    </div>
    <!-- settings and urls -->
    <div class="rounded-b-1 flex flex-row w-full bg-emerald bg-opacity-60">
      <div class="ml-auto flex flex-row">
        <!-- open settings -->
        <div class="cursor-pointer" @click="isSettingsOpen = true">
          <div class="flex p-2 rounded-br-1">
            <div class="i-akar-icons:settings-horizontal text-2xl" />
          </div>
        </div>
        <!-- github repo -->
        <a href="https://github.com/lalagis/AOI_finder">
          <div class="flex p-2 rounded-br-1">
            <div class="i-akar-icons:github-fill text-2xl" />
          </div>
        </a>
      </div>
    </div>
  </div>

  <!-- hidden modals -->
  <settings-modal :is-open="isSettingsOpen" @close-modal="isSettingsOpen = false" />
  <download-modal :is-open="isDownloadOpen" :file="currentFile!" @close-modal="onCloseDownload" />
</template>
