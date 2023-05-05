import { useRecoilValue } from 'recoil'
import { guildRolesState, textChannelsState } from '../state'

export const useTextChannels = () => {
  return useRecoilValue(textChannelsState)
}

export const useGuildRoles = () => {
  return useRecoilValue(guildRolesState)
}
