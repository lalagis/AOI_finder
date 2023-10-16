<script setup lang="ts">
const isSettingsOpen = $ref(false)

const tutorial = $ref([
  '暂无图层，以下是教程',
  '1. 在设置中配置百度地图ak',
  '2. 在搜索框输入区域与目标',
  '3. 在该区域查看关联的AOI图层',
  '4. 按格式选择数据下载',
])
</script>

<template>
  <div class="absolute left-5 bottom-10 bg-white rounded-1 drop-shadow-md pt-4 h-[40vh] w-[230px] z-10 flex flex-col">
    <ul v-auto-animate class="text-sm px-3 flex flex-col gap-y-2">
      <li v-for="(item, index) in tutorial" :key="index" class="text-gray-500">
        {{ item }}
      </li>
    </ul>
    <div class="w-full flex flex-col items-center mt-auto">
      <p class="text-gray text-sm">
        AOI_finder 2023 © lulala
      </p>
    </div>
    <div class="rounded-b-1 flex flex-row w-full bg-emerald bg-opacity-60">
      <div class="ml-auto flex flex-row">
        <div class="cursor-pointer" @click="isSettingsOpen = true">
          <div class="flex p-2 rounded-br-1">
            <div class="i-akar-icons:settings-horizontal text-2xl" />
          </div>
        </div>
        <a href="https://github.com/lalagis/AOI_finder">
          <div class="flex p-2 rounded-br-1">
            <div class="i-akar-icons:github-fill text-2xl" />
          </div>
        </a>
      </div>
    </div>
  </div>

  <settings-modal :is-open="isSettingsOpen" @close-modal="isSettingsOpen = false" />
</template>
