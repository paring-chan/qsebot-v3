import React from 'react'
import { Drawer, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { ADMIN_DRAWER_WIDTH } from '../../constants'
import AdminSidebarContent from './SidebarContent'

type AdminSidebarProps = {
    open: boolean
    onClose: () => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, onClose }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <>
            {isMobile ? (
                <Drawer
                    sx={{
                        width: ADMIN_DRAWER_WIDTH,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: ADMIN_DRAWER_WIDTH, boxSizing: 'border-box' },
                    }}
                    open={open}
                    onClose={onClose}
                >
                    <Toolbar />
                    <AdminSidebarContent />
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: ADMIN_DRAWER_WIDTH,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: ADMIN_DRAWER_WIDTH, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <AdminSidebarContent />
                </Drawer>
            )}
        </>
    )
}

export default AdminSidebar
