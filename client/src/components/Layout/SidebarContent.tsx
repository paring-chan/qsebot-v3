import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Bookmark, SavingsOutlined } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'

const SidebarContent: React.FC = () => {
    const location = useLocation()

    return (
        <div>
            <List>
                <ListItem button component={Link} to="/" selected={location.pathname === '/'}>
                    <ListItemIcon>
                        <Bookmark />
                    </ListItemIcon>
                    <ListItemText primary="사용설명" />
                </ListItem>
                <ListItem button component={Link} to="/ranking" selected={location.pathname === '/ranking'}>
                    <ListItemIcon>
                        <SavingsOutlined />
                    </ListItemIcon>
                    <ListItemText primary="랭킹" />
                </ListItem>
            </List>
        </div>
    )
}

export default SidebarContent
