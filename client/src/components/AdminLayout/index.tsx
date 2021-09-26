import React from 'react'
import AdminHeader from './Header'
import AdminSidebar from './Sidebar'
import { Box, Container, Toolbar } from '@mui/material'

const AdminLayout: React.FC = ({ children }) => {
    const [drawer, setDrawer] = React.useState(false)

    return (
        <div>
            <AdminHeader openDrawer={() => setDrawer(!drawer)} />
            <Box sx={{ display: 'flex' }}>
                <AdminSidebar open={drawer} onClose={() => setDrawer(false)} />
                <Container component="main" sx={{ flexGrow: 1 }}>
                    <Toolbar />
                    <Box sx={{ my: 2 }}>{children}</Box>
                </Container>
            </Box>
        </div>
    )
}

export default AdminLayout
