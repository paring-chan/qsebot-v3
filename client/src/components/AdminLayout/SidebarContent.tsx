import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Description, Message, Person, Quiz } from '@mui/icons-material'
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
                    <ListItemText primary="관리자 목록" />
                </ListItem>
                <ListItem button component={Link} to="/admin/quiz" selected={location.pathname.startsWith('/admin/quiz')}>
                    <ListItemIcon>
                        <Quiz />
                    </ListItemIcon>
                    <ListItemText primary="퀴즈 관리" />
                </ListItem>
                <ListItem button component={Link} to="/admin/commands" selected={location.pathname.startsWith('/admin/commands')}>
                    <ListItemIcon>
                        <Message />
                    </ListItemIcon>
                    <ListItemText primary="커스텀 커맨드 관리" />
                </ListItem>
                <ListItem button component={Link} to="/admin/scripts" selected={location.pathname.startsWith('/admin/scripts')}>
                    <ListItemIcon>
                        <Description />
                    </ListItemIcon>
                    <ListItemText primary="스크립트 관리" />
                </ListItem>
            </List>
        </div>
    )
}

export default AdminSidebarContent
