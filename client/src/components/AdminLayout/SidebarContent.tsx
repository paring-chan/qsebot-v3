import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Person } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'

const AdminSidebarContent: React.FC = () => {
    const location = useLocation()

    return (
        <div>
            <List>
                <ListItem button component={Link} to="/admin/admins" selected={location.pathname === '/admin/admins'}>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText primary="관리자 관리" />
                </ListItem>
            </List>
        </div>
    )
}

export default AdminSidebarContent
