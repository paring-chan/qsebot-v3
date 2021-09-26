import React from 'react'
import { useRequest } from '../../utils/request'
import { User } from '../../typings'
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'

const Admins: React.FC = () => {
    const data = useRequest<User[]>('/admin/admins').data!

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <Typography variant="h4" fontWeight={700}>
                    관리자 목록
                </Typography>
                <div style={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Button startIcon={<Add />}>추가하기</Button>
                </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
                <List>
                    {data.map((x, i) => (
                        <ListItem key={i}>
                            <ListItemAvatar>
                                <Avatar src={x.discord.displayAvatarURL} />
                            </ListItemAvatar>
                            <ListItemText primary={x.discord.tag} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </div>
    )
}

export default Admins
