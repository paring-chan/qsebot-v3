import { selector } from 'recoil'
import axios from 'axios'
import type { User } from './typings'
import type { CustomEmoji } from 'emoji-mart'
import { axios as api } from './utils/request'

export const userState = selector<User>({
    key: 'user',
    get: async () => {
        const { data } = await axios.get('/auth/current')
        return data
    },
})

export const customEmojisState = selector<CustomEmoji[]>({
    key: 'customEmojis',
    get: async () => {
        const { data } = await api.get<{ url: string; str: string; name: string }[]>('/admin/emojis')

        return data.map(
            (x) =>
                ({
                    name: x.name,
                    imageUrl: x.url,
                    short_names: [x.name],
                    id: x.str,
                } as CustomEmoji)
        )
    },
})

type TextChannel = { name: string; id: string }
type Role = { name: string; id: string }

export const textChannelsState = selector<TextChannel[]>({
    key: 'textChannels',
    get: async () => {
        const { data } = await api.get<TextChannel[]>('/admin/textChannels')

        return data
    },
})

export const guildRolesState = selector<Role[]>({
    key: 'roles',
    get: async () => {
        const { data } = await api.get<TextChannel[]>('/admin/roles')

        return data
    },
})
