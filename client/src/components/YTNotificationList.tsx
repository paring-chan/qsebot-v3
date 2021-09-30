import React from 'react'
import { Box, ListItem, ListItemText, Pagination } from '@mui/material'
import { Link } from 'react-router-dom'
import { useRequest } from '../utils/request'

const YTNotificationList: React.FC<{ search: string }> = ({ search }) => {
    const [page, setPage] = React.useState(1)

    const { data: quizList, pages } = useRequest(`/admin/notifications/youtube?page=${page}&search=${encodeURIComponent(search)}`).data!

    return (
        <Box sx={{ mt: 2 }}>
            {(quizList as any[]).map((x, i) => (
                <ListItem key={i} button component={Link} to={`/admin/notifications/youtube/${x._id}`}>
                    <ListItemText primary={x.channel} />
                </ListItem>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={pages} page={page} color="primary" onChange={(e, v) => setPage(v)} />
            </Box>
        </Box>
    )
}

export default YTNotificationList
