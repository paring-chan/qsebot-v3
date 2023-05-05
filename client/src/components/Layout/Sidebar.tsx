import React from 'react'
import { Drawer, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { ADMIN_DRAWER_WIDTH } from '../../constants'
import SidebarContent from './SidebarContent'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
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
          <SidebarContent />
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
          <SidebarContent />
        </Drawer>
      )}
    </>
  )
}

export default Sidebar
