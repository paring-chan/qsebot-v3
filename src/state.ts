import { selector } from 'recoil'
import axios from 'axios'

export type User = {
    qse: {
        admin: boolean
        id: string
    }
    discord: {
        tag: string
        displayAvatarURL: string
    }
}

export const userState = selector<User>({
    key: 'user',
    get: async () => {
        const { data } = await axios.get('/auth/current')
        return data
    },
})
