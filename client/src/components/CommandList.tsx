import React from 'react'
import { Box, ListItem, ListItemText, Pagination } from '@mui/material'
import { Link } from 'react-router-dom'
import { useRequest } from '../utils/request'

const QuizList: React.FC<{ search: string }> = ({ search }) => {
    const [page, setPage] = React.useState(1)

    const request = useRequest(`/admin/commands?page=${page}&search=${encodeURIComponent(search)}`)

    const { data: quizList, pages } = request.data!

    return (
        <Box sx={{ mt: 2 }}>
            {(quizList as any[]).map((x, i) => (
                <ListItem key={i} button component={Link} to={`/admin/commands/${x._id}`}>
                    <ListItemText primary={x.message} />
                </ListItem>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={pages} page={page} color="primary" onChange={(e, v) => setPage(v)} />
            </Box>
        </Box>
    )
}

export default QuizList
