import React from 'react'
import { Box, ListItemButton, ListItemText, Pagination } from '@mui/material'
import { Link } from 'react-router-dom'
import { getAnswerCount } from '../utils/getAnswerCount'
import { useRequest } from '../utils/request'

const QuizList: React.FC<{ search: string }> = ({ search }) => {
  const [page, setPage] = React.useState(1)

  const { data: quizList, pages } = useRequest(`/admin/quiz?page=${page}&search=${encodeURIComponent(search)}`).data!

  return (
    <Box sx={{ mt: 2 }}>
      {(quizList as any[]).map((x, i) => (
        <ListItemButton key={i} component={Link} to={`/admin/quiz/${x._id}`}>
          <ListItemText primary={x.question} secondary={`버튼 ${getAnswerCount(x.answers)}개`} />
        </ListItemButton>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={pages} page={page} color="primary" onChange={(_, v) => setPage(v)} />
      </Box>
    </Box>
  )
}

export default QuizList
