import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { axios, useRequest } from '../../../utils/request'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material'
import { Add, Delete, Remove, Save } from '@mui/icons-material'
import { useForceUpdate } from '../../../utils/update'
import type { AnswerButton } from '../../../../../src/models'
import QuizAnswerButton from '../../../components/QuizAnswerButton'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import { getAnswerCount } from '../../../utils/getAnswerCount'

const QuizEdit: React.FC = () => {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>()

  const { data } = useRequest(`/admin/quiz/${id}`)

  const [question, setQuestion] = React.useState(data.question)

  const [answers] = React.useState<AnswerButton[][]>(data.answers)

  const [saving, setSaving] = React.useState<boolean>(false)

  const [deleteDialog, setDeleteDialog] = React.useState(false)

  const [deleting, setDeleting] = React.useState(false)

  const { enqueueSnackbar } = useSnackbar()

  const forceUpdate = useForceUpdate()

  const history = useHistory()

  return (
    <div>
      <Box sx={{ mt: 4, display: 'flex' }}>
        <Typography variant="h4" fontWeight={700}>
          퀴즈 관리
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="error" variant="outlined" startIcon={<Delete />} onClick={() => setDeleteDialog(true)}>
            삭제하기
          </Button>
          <Dialog open={deleteDialog} onClose={deleting ? () => null : () => setDeleteDialog(false)}>
            <DialogTitle>퀴즈 삭제</DialogTitle>
            <DialogContent>
              <DialogContentText>이 퀴즈를 삭제할까요?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={() => setDeleteDialog(false)} disabled={deleting}>
                취소
              </Button>
              <Button
                color="error"
                disabled={deleting}
                onClick={async () => {
                  try {
                    setDeleting(true)
                    await axios.delete(`/admin/quiz/${id}`)
                    setDeleting(false)
                    enqueueSnackbar('퀴즈가 삭제되었습니다.', { variant: 'success' })
                    history.push('/admin/quiz')
                  } catch (e: any) {
                    enqueueSnackbar(e.message, { variant: 'error' })
                    setDeleting(false)
                  }
                }}
              >
                삭제하기
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <TextField label="질문" disabled={saving} variant="standard" fullWidth value={question} onChange={(e) => setQuestion(e.target.value)} multiline />
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexDirection: 'column' }}>
        {answers.map((x, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2 }}>
            {x.map((y, j) => (
              <QuizAnswerButton
                delete={() => {
                  x.splice(j, 1)
                  forceUpdate()
                }}
                disabled={saving}
                update={forceUpdate}
                button={y}
                key={j}
              />
            ))}
            <Button
              startIcon={<Add />}
              variant="outlined"
              disabled={saving}
              onClick={() => {
                x.push({ label: 'Text', answer: 'Text', emoji: '', style: 'PRIMARY' })
                forceUpdate()
              }}
            >
              버튼 추가하기
            </Button>
            <Button
              startIcon={<Remove />}
              variant="outlined"
              color="error"
              disabled={saving}
              onClick={() => {
                answers.splice(i, 1)
                forceUpdate()
              }}
            >
              열 삭제하기
            </Button>
          </Box>
        ))}
        <Button
          variant="contained"
          disableElevation
          startIcon={<Add />}
          onClick={() => {
            answers.push([])
            forceUpdate()
          }}
          disabled={saving}
        >
          열 추가하기
        </Button>
        <LoadingButton
          loading={saving}
          variant="contained"
          disableElevation
          color="success"
          startIcon={<Save />}
          onClick={async () => {
            try {
              setSaving(true)

              if (!getAnswerCount(answers)) {
                enqueueSnackbar('최소 1개의 버튼이 필요합니다.', { variant: 'error' })
                return
              }

              if (answers.find((x) => !x.length)) {
                enqueueSnackbar('모든 열에는 최소 1개의 버튼이 필요합니다.', { variant: 'error' })
                return
              }

              if (answers.find((x) => x.find((y) => !y.label && !y.emoji))) {
                enqueueSnackbar('모든 버튼에는 텍스트 또는 이모지가 필요합니다.', { variant: 'error' })
                return
              }

              const { data } = await axios.put(`/admin/quiz/${id}`, { question, answers })
              if (data.error) {
                enqueueSnackbar(data.error, { variant: 'error' })
                return
              }
              enqueueSnackbar('저장되었습니다.', { variant: 'success' })
            } catch (e: any) {
              enqueueSnackbar(e.message, { variant: 'error' })
            } finally {
              setSaving(false)
            }
          }}
        >
          저장하기
        </LoadingButton>
      </Box>
    </div>
  )
}

export default QuizEdit
