import React from 'react'
import { AppBar, Button, IconButton, Link, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { Menu } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import AccountMenu from './AccountMenu'
import { useAccount } from '../../utils/user'

type DrawerProps = {
    openDrawer: () => void
}

const AdminHeader: React.FC<DrawerProps> = ({ openDrawer }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const user = useAccount()

    return (
        <AppBar sx={{ zIndex: theme.zIndex.drawer + 1, background: '#fd8eaa' }} elevation={0}>
            <Toolbar>
                {isMobile && (
                    <IconButton sx={{ mr: 2 }} color="inherit" onClick={openDrawer}>
                        <Menu />
                    </IconButton>
                )}
                <Link color="inherit" underline="none" component={RouterLink} to="/" variant="h6" fontWeight={700}>
                    큐새
                </Link>
                <div style={{ flexGrow: 1 }} />
                {user ? (
                    <AccountMenu />
                ) : (
                    <Button href="/auth/login" color="inherit">
                        로그인
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default AdminHeader
