import React from 'react'
import { AppBar, Chip, IconButton, Link, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { Menu } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import AccountMenu from '../Layout/AccountMenu'

type DevelopersDrawerProps = {
  openDrawer: () => void
}

const AdminHeader: React.FC<DevelopersDrawerProps> = ({ openDrawer }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <AppBar sx={{ zIndex: theme.zIndex.drawer + 1, background: '#fd8eaa' }} elevation={0}>
      <Toolbar>
        {isMobile && (
          <IconButton sx={{ mr: 2 }} color="inherit" onClick={openDrawer}>
            <Menu />
          </IconButton>
        )}
        <Link color="inherit" underline="none" component={RouterLink} to="/admin" variant="h6" fontWeight={700}>
          큐새
          <Chip
            label="ADMIN"
            variant="outlined"
            sx={{
              borderColor: '#fff',
              color: '#fff',
              ml: 1,
              cursor: 'pointer',
            }}
          />
        </Link>
        <div style={{ flexGrow: 1 }} />
        <AccountMenu />
      </Toolbar>
    </AppBar>
  )
}

export default AdminHeader
