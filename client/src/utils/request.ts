import { AxiosRequestConfig, default as axiosStatic } from 'axios'
import useSWR from 'swr'

export const axios = axiosStatic.create({
  baseURL: '/api',
})

const fetcher = (...options: [string, AxiosRequestConfig | undefined]) => {
  return axios.get(...options).then((x) => x.data)
}

export function useRequest<T = any>(url: string, config?: AxiosRequestConfig) {
  return useSWR<T>([url, config], { fetcher, suspense: true })
}
