import { useRecoilValue } from 'recoil'
import { textChannelsState } from '../state'

export const useTextChannels = () => {
    return useRecoilValue(textChannelsState)
}
