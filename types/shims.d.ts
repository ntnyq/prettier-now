declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  /**
   * Vue single-file component module default export.
   */
  const component: DefineComponent<{}, {}, any>

  export default component
}
