import React from 'react'
import { useAccount } from '../utils/user'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'

const Main: React.FC = () => {
    const user = useAccount()

    return (
        <div>
            {user ? <Button href="/auth/logout">로그아웃</Button> : <Button href="/auth/login">로그인</Button>}
            {user && user.qse.admin && (
                <Button component={Link} to="/admin">
                    관리
                </Button>
            )}
        </div>
    )
}

export default Main
