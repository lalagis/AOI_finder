<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import type { FeatureCollection } from 'geojson'
import shpwrite from '@mapbox/shp-write'

const props = defineProps<{
  isOpen: boolean
  file: FeatureCollection
}>()
const emits = defineEmits<{
  (e: 'closeModal'): void
}>()
const isOpen = $computed(() => props.isOpen)

function onClickGeojson() {
  const str = JSON.stringify(props.file)
  const blob = new Blob([str], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  // @ts-expect-error has name
  link.download = `${props.file.name || 'data'}.geojson`
  link.click()
}

function onClickShp() {
  shpwrite.download(props.file, {
    // @ts-expect-error has name
    filename: props.file.name || 'data',
    outputType: 'blob',
    compression: 'DEFLATE',
  })
}
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10" @close="emits('closeModal')">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                下载
              </DialogTitle>
              <div class="mt-4 flex flex-row items-center justify-between">
                <div
                  class="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transition-all duration-300"
                  @click="onClickShp"
                >
                  Shapefile 格式
                </div>
                <div
                  class="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transition-all duration-300"
                  @click="onClickGeojson"
                >
                  GeoJSON 格式
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
