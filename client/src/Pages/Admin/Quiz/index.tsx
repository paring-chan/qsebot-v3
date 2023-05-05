import React from 'react'
import { axios } from '../../../utils/request'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'
import QuizList from '../../../components/QuizList'

const QuizListPage: React.FC = () => {
  const [search, setSearch] = React.useState('')

  const [addDialog, setAddDialog] = React.useState(false)

  const [adding, setAdding] = React.useState(false)

  const { enqueueSnackbar } = useSnackbar()

  const history = useHistory()

  const [question, setQuestion] = React.useState('')

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4" fontWeight={700}>
          퀴즈 관리
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<Add />}
            onClick={() => {
              setQuestion('')
              setAddDialog(true)
            }}
          >
            퀴즈 추가하기
          </Button>
        </Box>
      </Box>
      <Dialog open={addDialog} onClose={adding ? () => {} : () => setAddDialog(false)}>
        <DialogTitle>퀴즈 추가</DialogTitle>
        <DialogContent>
          <TextField value={question} onChange={(e) => setQuestion(e.target.value)} label="질문 내용" multiline variant="standard" />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setAddDialog(false)} disabled={adding}>
            취소
          </Button>
          <Button
            disabled={adding}
            onClick={async () => {
              setAdding(true)
              try {
                const { data } = await axios.post<{ error: string; id: string }>('/admin/quiz', { question })
                if (data.error) {
                  enqueueSnackbar(data.error, { variant: 'error' })
                  setAdding(false)
                  return
                }
                history.push(`/admin/quiz/${data.id}`)
              } catch (e: any) {
                enqueueSnackbar(e.message, { variant: 'error' })
                setAdding(false)
                setAddDialog(false)
              }
            }}
          >
            추가하기
          </Button>
        </DialogActions>
      </Dialog>
      <TextField fullWidth sx={{ mt: 2 }} label="검색어를 입력하세요..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <React.Suspense fallback={<CircularProgress />}>
        <QuizList search={search} />
      </React.Suspense>
    </div>
  )
}

export default QuizListPage
