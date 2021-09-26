import { useRecoilValue } from 'recoil'
import { userState } from '../state'

export const useAccount = () => {
    return useRecoilValue(userState)
}
