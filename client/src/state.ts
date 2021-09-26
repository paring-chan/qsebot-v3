import { selector } from 'recoil'
import axios from 'axios'
import { User } from './typings'

export const userState = selector<User>({
    key: 'user',
    get: async () => {
        const { data } = await axios.get('/auth/current')
        return data
    },
})
