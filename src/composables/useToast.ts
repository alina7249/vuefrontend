import { useToast } from 'vue-toastification'

export interface ToastParams {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  options?: any
}

// 创建 toast 实例
const toast = useToast()

// 导出 toast 方法
export const toastAPI = {
  success: (message: string, options?: any) => {
    return toast.success(message, options)
  },
  
  error: (message: string, options?: any) => {
    return toast.error(message, options)
  },
  
  warning: (message: string, options?: any) => {
    return toast.warning(message, options)
  },
  
  info: (message: string, options?: any) => {
    return toast.info(message, options)
  },
  
  // 兼容 Sonner 的简单 toast 调用
  default: (message: string, options?: any) => {
    return toast(message, options)
  }
}

// 导出默认 toast 实例（兼容 Sonner 的导入方式）
export default toastAPI