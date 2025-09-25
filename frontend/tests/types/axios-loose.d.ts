import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig<D = any> {
    headers?: any
  }

  interface InternalAxiosRequestConfig<D = any> {
    headers: any
  }
}
