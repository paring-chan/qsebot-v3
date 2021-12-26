import React from 'react'
import Header from './Header'
import { Box, Container, Toolbar } from '@mui/material'
import Sidebar from './Sidebar'

const Layout: React.FC<{ previewMode?: boolean }> = ({ children, previewMode }) => {
    const [drawer, setDrawer] = React.useState(false)
    return (
        <div style={{ minHeight: previewMode ? 'unset' : '100vh', height: previewMode ? '100%' : undefined, position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <Header previewMode={previewMode} openDrawer={() => setDrawer(!drawer)} />
            <Box sx={{ display: 'flex', flexGrow: 1, overflowY: 'scroll' }}>
                {!previewMode && <Sidebar open={drawer} onClose={() => setDrawer(false)} />}
                <Container component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 2 }}>
                    {!previewMode && <Toolbar />}
                    <Box sx={{ flexGrow: 1 }}>{children}</Box>
                </Container>
            </Box>
        </div>
    )
}

export default Layout
