import { AxiosRequestConfig, default as axiosStatic } from 'axios'
import useSWR from 'swr'

export const axios = axiosStatic.create({
    baseURL: '/api',
})

const fetcher = (...options: [string, AxiosRequestConfig | undefined]) => {
    return axios.get(...options).then((x) => x.data)
}

export const useRequest = (url: string, config?: AxiosRequestConfig) => {
    return useSWR([url, config], { fetcher, suspense: true })
}
