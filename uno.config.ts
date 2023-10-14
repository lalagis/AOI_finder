import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno({ dark: 'media' }),
    presetIcons(),
    presetTypography(),
    // presetWebFonts({
    //   provider: 'google',
    //   fonts: {
    //     sans: 'Noto Sans SC',
    //   }
    // })
  ],
})
