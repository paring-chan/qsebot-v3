import React, { useRef } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { axios, useRequest } from '../../../utils/request'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material'
import { Delete, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import Editor from '@monaco-editor/react'
import { useForceUpdate } from '../../../utils/update'

const BlacklistEdit: React.FC = () => {
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>()

  const { data } = useRequest(`/admin/blacklist/${id}`)

  const [messages, setMessages] = React.useState<string[]>(data.trigger)

  const [saving, setSaving] = React.useState<boolean>(false)

  const [deleteDialog, setDeleteDialog] = React.useState(false)

  const editorRef = useRef<any>(null)

  const [deleting, setDeleting] = React.useState(false)

  const { enqueueSnackbar } = useSnackbar()

  const history = useHistory()

  const update = useForceUpdate()

  const [value, setValue] = React.useState('')

  return (
    <div style={{ height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Typography variant="h4" fontWeight={700}>
            검열 관리
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="error" variant="outlined" startIcon={<Delete />} onClick={() => setDeleteDialog(true)}>
              삭제하기
            </Button>
            <Dialog open={deleteDialog} onClose={deleting ? () => null : () => setDeleteDialog(false)}>
              <DialogTitle>알림 삭제</DialogTitle>
              <DialogContent>
                <DialogContentText>이 알림 스크립트를 삭제할까요?</DialogContentText>
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
                      await axios.delete(`/admin/blacklist/${id}`)
                      setDeleting(false)
                      enqueueSnackbar('알림이 삭제되었습니다.', { variant: 'success' })
                      history.push('/admin/blacklist')
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

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', maxWidth: '100%' }}>
          {messages.map((x, i) => (
            <Chip
              onDelete={() => {
                if (messages.length <= 1) {
                  enqueueSnackbar('최소 1개의 단어가 필요합니다', { variant: 'error' })
                  return
                }
                setMessages(messages.filter((_, j) => j !== i))
              }}
              key={i}
              label={x}
            />
          ))}
        </Box>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!value) return
            setValue('')
            if (messages.includes(value)) return
            messages.push(value)
            update()
          }}
        >
          <TextField variant="standard" placeholder="추가할 단어" fullWidth value={value} onChange={(e) => setValue(e.target.value)} />
        </form>

        <div style={{ flexGrow: 1 }}>
          <Editor
            onMount={(editor) => {
              editorRef.current = editor
            }}
            height="100%"
            defaultLanguage="javascript"
            defaultValue={data.script}
          />
        </div>
        <LoadingButton
          sx={{ mb: 2 }}
          loading={saving}
          variant="contained"
          disableElevation
          color="success"
          startIcon={<Save />}
          onClick={async () => {
            try {
              setSaving(true)

              const { data } = await axios.put(`/admin/blacklist/${id}`, { trigger: messages, script: editorRef.current.getValue() })
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

export default BlacklistEdit
