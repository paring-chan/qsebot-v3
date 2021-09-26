import { useRecoilValue } from 'recoil'
import { customEmojisState } from '../state'

export const useCustomEmojis = () => {
    return useRecoilValue(customEmojisState)
}
