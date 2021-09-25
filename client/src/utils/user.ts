import { useRecoilValue } from 'recoil'
import { userState } from '../../../src/state'

export const useAccount = () => {
    return useRecoilValue(userState)
}
