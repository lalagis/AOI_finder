<!-- open when click settings -->
<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import DarkPreviewPNG from '/dark_preview.png'
import LightPreviewPNG from '/light_preview.png'

// receive isOpen status
const props = defineProps<{
  isOpen: boolean
}>()
// method to close
const emits = defineEmits<{
  (e: 'closeModal'): void
}>()

// is the modal open
const isOpen = $computed(() => props.isOpen)

const config = useConfigStore()
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
              <!-- title -->
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                设置
              </DialogTitle>
              <!-- basemap style -->
              <div class="flex mt-2">
                <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  <div class="i-akar-icons:map" />
                </span>
                <div class="grid grid-rows-1 grid-cols-2 items-center gap-x-2 ml-2">
                  <img
                    class="rounded-md h-30 object-cover cursor-pointer hover:scale-105 transition-all duration-300"
                    :src="LightPreviewPNG"
                    @click="config.basemapStyle = 'light'"
                  >
                  <img
                    class="rounded-md h-30 object-cover cursor-pointer hover:scale-105 transition-all duration-300"
                    :src="DarkPreviewPNG"
                    @click="config.basemapStyle = 'dark'"
                  >
                </div>
              </div>
              <!-- baidu map ak -->
              <div class="flex mt-2">
                <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  <div class="i-akar-icons:key" />
                </span>
                <input
                  v-model="config.appKey"
                  type="text"
                  class="focus:outline-none rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-emerald-500 focus:border-emerald-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                  placeholder="请粘贴百度地图API app_key(ak)"
                >
              </div>
              <!-- tips for ak -->
              <div class="w-full mt-2">
                <div class="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
                  <Disclosure v-slot="{ open }">
                    <DisclosureButton
                      class="flex w-full justify-between rounded-lg bg-emerald-100 px-4 py-2 text-left text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500 focus-visible:ring-opacity-75"
                    >
                      <span>在哪里获取百度地图ak(app_key)?</span>
                      <div
                        :class="open ? 'rotate-180 transform' : ''"
                        class="h-5 w-5 text-emerald-500 i-akar-icons:chevron-up"
                      />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
                      前往
                      <a href="https://lbsyun.baidu.com/apiconsole/key#/home" class="underline text-emerald">百度地图开放平台</a>
                      ，实名注册后创建应用。类别服务端，请求校验模式IP白名单，设置为0.0.0.0/0，即允许任意IP访问（本开源应用并不会盗用您的密钥，功能基于本地密钥实现）。
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              </div>

              <!-- hide button -->
              <div class="mt-4">
                <div
                  class="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transition-all duration-300"
                  @click="emits('closeModal')"
                >
                  完成并返回
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
