import React from 'react'
import { Box, ListItemButton, ListItemText, Pagination } from '@mui/material'
import { Link } from 'react-router-dom'
import { useRequest } from '../utils/request'
import { useTextChannels } from '../utils/channels'

const YTNotificationList: React.FC<{ search: string }> = ({ search }) => {
    const [page, setPage] = React.useState(1)

    const { data: quizList, pages } = useRequest(`/admin/notifications/youtube?page=${page}&search=${encodeURIComponent(search)}`).data!

    const channels = useTextChannels()

    return (
        <Box sx={{ mt: 2 }}>
            {(quizList as any[]).map((x, i) => (
                <ListItemButton key={i} component={Link} to={`/admin/notifications/youtube/${x._id}`}>
                    <ListItemText primary={`${x.channelId} - ${channels.find((y) => y.id === x.channel)?.name}`} />
                </ListItemButton>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={pages} page={page} color="primary" onChange={(_, v) => setPage(v)} />
            </Box>
        </Box>
    )
}

export default YTNotificationList
