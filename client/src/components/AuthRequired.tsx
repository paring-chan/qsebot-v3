import React from 'react'
import { useAccount } from '../utils/user'
import { Redirect } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const AuthRequired: React.FC = ({ children }) => {
    const user = useAccount()
    const { enqueueSnackbar } = useSnackbar()

    if (!user) {
        enqueueSnackbar('로그인이 필요합니다', { variant: 'error' })
        return <Redirect to="/" />
    }

    return <>{children}</>
}

export default AuthRequired
