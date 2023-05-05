import React from 'react'
import { Divider, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { AutoFixNormal, Dns, ListOutlined, Message, Notifications, Person, Quiz, Shop } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'

const AdminSidebarContent: React.FC = () => {
    const location = useLocation()

    return (
        <div>
            <List>
                <ListSubheader>기본</ListSubheader>
                <ListItemButton component={Link} to="/admin/admins" selected={location.pathname === '/admin/admins'}>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText primary="관리자 목록" />
                </ListItemButton>
                <ListItemButton component={Link} to="/admin/quiz" selected={location.pathname.startsWith('/admin/quiz')}>
                    <ListItemIcon>
                        <Quiz />
                    </ListItemIcon>
                    <ListItemText primary="퀴즈 관리" />
                </ListItemButton>
                <ListItemButton component={Link} to="/admin/commands" selected={location.pathname.startsWith('/admin/commands')}>
                    <ListItemIcon>
                        <Message />
                    </ListItemIcon>
                    <ListItemText primary="커스텀 커맨드 관리" />
                </ListItemButton>
                <Divider />
                <ListSubheader>서버 관리</ListSubheader>
                <ListItemButton component={Link} to="/admin/blacklist" selected={location.pathname.startsWith('/admin/blacklist')}>
                    <ListItemIcon>
                        <AutoFixNormal />
                    </ListItemIcon>
                    <ListItemText primary="검열 관리" />
                </ListItemButton>
                <ListItemButton component={Link} to="/admin/reactionroles" selected={location.pathname.startsWith('/admin/reactionroles')}>
                    <ListItemIcon>
                        <AutoFixNormal />
                    </ListItemIcon>
                    <ListItemText primary="역할지급 관리" />
                </ListItemButton>
                <Divider />
                <ListSubheader>시스템</ListSubheader>
                <ListItemButton component="a" href="/admin/db">
                    <ListItemIcon>
                        <Dns />
                    </ListItemIcon>
                    <ListItemText primary="데이터베이스 관리" />
                </ListItemButton>
                <Divider />
                <ListSubheader>상점</ListSubheader>
                <ListItemButton component={Link} to="/admin/shop" selected={location.pathname === '/admin/shop'}>
                    <ListItemIcon>
                        <ListOutlined />
                    </ListItemIcon>
                    <ListItemText primary="상점 아이템 관리" />
                </ListItemButton>
                <Divider />
                <ListSubheader>기타</ListSubheader>
                <ListItemButton component={Link} to="/admin/notifications/youtube" selected={location.pathname.startsWith('/admin/notifications/youtube')}>
                    <ListItemIcon>
                        <Notifications />
                    </ListItemIcon>
                    <ListItemText primary="유튜브 알림 관리" />
                </ListItemButton>
            </List>
        </div>
    )
}

export default AdminSidebarContent
