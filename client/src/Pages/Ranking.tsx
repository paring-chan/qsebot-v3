import React from 'react'
import { useRequest } from '../utils/request'
import { Avatar, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'

const Ranking: React.FC = () => {
    const { data } = useRequest<any[]>('/currency/ranking')

    return (
        <div>
            <List>
                {data.map((x, i) => (
                    <ListItem key={i}>
                        <ListItemIcon>
                            <Avatar src={x.user.displayAvatarURL} />
                        </ListItemIcon>
                        <ListItemText primary={x.user.tag} secondary={`#${i + 1} - ${x.money}`} />
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default Ranking
