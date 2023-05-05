import { atom, DefaultValue, selector, useResetRecoilState, useSetRecoilState } from 'recoil'
import axios from 'axios'
import type { User } from './typings'
import type { CustomEmoji } from 'emoji-mart'
import { axios as api } from './utils/request'

export const useReloadUser = () => {
  return useResetRecoilState(userState)
}

export const userState = selector<User>({
  key: 'user',
  get: async ({ get }) => {
    get(refreshUserState)
    console.log('load user')
    const { data } = await axios.get('/auth/current')
    return data
  },
  set: ({ set }, value) => {
    if (value instanceof DefaultValue) {
      set(refreshUserState, (v) => v + 1)
    }
  },
})

export const refreshUserState = atom<number>({
  default: 0,
  key: 'refreshUser',
})

export const adminDisablePaddingState = atom<boolean>({
  key: 'adminDisablePadding',
  default: false,
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
