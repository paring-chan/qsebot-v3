import React from 'react'
import { useAccount } from '../utils/user'

const WaitReady: React.FC = ({ children }) => {
  useAccount()
  return <>{children}</>
}

export default WaitReady
