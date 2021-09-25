import React from 'react'
import { AppBar, IconButton, Link, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { Menu } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

type DevelopersDrawerProps = {
    openDrawer: () => void
}

const AdminHeader: React.FC<DevelopersDrawerProps> = ({ openDrawer }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <AppBar sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {isMobile && (
                    <IconButton sx={{ mr: 2 }} color="inherit" onClick={openDrawer}>
                        <Menu />
                    </IconButton>
                )}
                <Link color="inherit" underline="none" component={RouterLink} to="/" variant="h6" fontWeight={700}>
                    큐새
                </Link>
            </Toolbar>
        </AppBar>
    )
}

export default AdminHeader
