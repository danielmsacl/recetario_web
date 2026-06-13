import _RemarkEmoji from 'remark-emoji'
import _Highlight from 'C:/Users/danie/OneDrive/Documentos/GitHub/WEB_EVA2/recetario_web/client/node_modules/@nuxtjs/mdc/dist/runtime/highlighter/rehype-nuxt.js'

export const remarkPlugins = {
  'remark-emoji': { instance: _RemarkEmoji },
}

export const rehypePlugins = {
  'highlight': { instance: _Highlight, options: {} },
}

export const highlight = {"theme":{"default":"github-light","dark":"github-dark"}}