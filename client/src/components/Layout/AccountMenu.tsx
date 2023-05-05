import React, { useState } from 'react'
import { useAccount } from '../../utils/user'
import { Avatar, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { LockOpen, Settings } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const AccountMenu: React.FC = () => {
  const user = useAccount()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <Avatar src={user.discord.displayAvatarURL} sx={{ width: 32, height: 32 }} />
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        MenuListProps={{
          disablePadding: true,
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>현재 ${user.qse.money} 보유중</MenuItem>
        {user.qse.admin && (
          <MenuItem component={Link} to="/admin">
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            관리자
          </MenuItem>
        )}
        <MenuItem component="a" href="/auth/logout">
          <ListItemIcon>
            <LockOpen />
          </ListItemIcon>
          로그아웃
        </MenuItem>
      </Menu>
    </>
  )
}

export default AccountMenu
