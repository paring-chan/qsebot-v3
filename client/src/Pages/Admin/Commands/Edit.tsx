import React, { useRef } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { axios, useRequest } from '../../../utils/request'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Delete, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import { CommandCondition } from '../../../../../src/sharedTypings'
import Editor from '@monaco-editor/react'

const CommandEdit: React.FC = () => {
    const {
        params: { id },
    } = useRouteMatch<{ id: string }>()

    const { data } = useRequest(`/admin/commands/${id}`)

    const [message, setMessage] = React.useState(data.message)

    const [condition, setCondition] = React.useState<CommandCondition>(data.condition)

    const [saving, setSaving] = React.useState<boolean>(false)

    const [deleteDialog, setDeleteDialog] = React.useState(false)

    const editorRef = useRef<any>(null)

    const [deleting, setDeleting] = React.useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const history = useHistory()

    return (
        <div style={{ height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h4" fontWeight={700}>
                        커맨드 관리
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button color="error" variant="outlined" startIcon={<Delete />} onClick={() => setDeleteDialog(true)}>
                            삭제하기
                        </Button>
                        <Dialog open={deleteDialog} onClose={deleting ? () => {} : () => setDeleteDialog(false)}>
                            <DialogTitle>명령 삭제</DialogTitle>
                            <DialogContent>
                                <DialogContentText>이 커맨드를 삭제할까요?</DialogContentText>
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
                                            await axios.delete(`/admin/commands/${id}`)
                                            setDeleting(false)
                                            enqueueSnackbar('명령어가 삭제되었습니다.', { variant: 'success' })
                                            history.push('/admin/commands')
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

                <TextField value={message} fullWidth onChange={(e) => setMessage(e.target.value)} label="메시지 내용" multiline variant="standard" />

                <FormControl variant="standard" fullWidth>
                    <InputLabel>실행 조건</InputLabel>
                    <Select value={condition} onChange={(e) => setCondition(e.target.value as CommandCondition)} variant="standard">
                        <MenuItem value={CommandCondition.EQUALS}>EQUALS</MenuItem>
                        <MenuItem value={CommandCondition.CONTAINS}>CONTAINS</MenuItem>
                        <MenuItem value={CommandCondition.STARTS_WITH}>STARTS_WITH</MenuItem>
                        <MenuItem value={CommandCondition.ENDS_WITH}>ENDS_WITH</MenuItem>
                        <MenuItem value={CommandCondition.REGEXP}>REGEXP</MenuItem>
                    </Select>
                </FormControl>

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

                            const { data } = await axios.put(`/admin/commands/${id}`, { message, condition, script: editorRef.current.getValue() })
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

export default CommandEdit
