import React from 'react'
import AdminHeader from './Header'
import AdminSidebar from './Sidebar'
import { Box, Container, Toolbar } from '@mui/material'

const AdminLayout: React.FC = ({ children }) => {
    const [drawer, setDrawer] = React.useState(false)

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AdminHeader openDrawer={() => setDrawer(!drawer)} />
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <AdminSidebar open={drawer} onClose={() => setDrawer(false)} />
                <Container component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Toolbar />
                    <Box sx={{ flexGrow: 1 }}>{children}</Box>
                </Container>
            </Box>
        </div>
    )
}

export default AdminLayout
