/// <reference types="vite/client" />
/// <reference types="vue-router" />
/// <reference types="vue" />

// Vue SFC 类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// motion-v 模块类型声明
declare module 'motion-v' {
  export const motion: any;
}
