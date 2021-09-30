import React, { useRef } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { axios, useRequest } from '../../../utils/request'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { Delete, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { useSnackbar } from 'notistack'
import Editor from '@monaco-editor/react'
import { useTextChannels } from '../../../utils/channels'

const YouTubeEdit: React.FC = () => {
    const {
        params: { id },
    } = useRouteMatch<{ id: string }>()

    const { data } = useRequest(`/admin/notifications/youtube/${id}`)

    const [channel, setChannel] = React.useState(data.channel)

    const [saving, setSaving] = React.useState<boolean>(false)

    const [deleteDialog, setDeleteDialog] = React.useState(false)

    const editorRef = useRef<any>(null)

    const [deleting, setDeleting] = React.useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const history = useHistory()

    const textChannels = useTextChannels()

    return (
        <div style={{ height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h4" fontWeight={700}>
                        유튜브 알림 관리
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button color="error" variant="outlined" startIcon={<Delete />} onClick={() => setDeleteDialog(true)}>
                            삭제하기
                        </Button>
                        <Dialog open={deleteDialog} onClose={deleting ? () => {} : () => setDeleteDialog(false)}>
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
                                            await axios.delete(`/admin/notifications/youtube/${id}`)
                                            setDeleting(false)
                                            enqueueSnackbar('알림이 삭제되었습니다.', { variant: 'success' })
                                            history.push('/admin/notifications/youtube')
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

                <FormControl variant="standard" disabled={saving} fullWidth>
                    <InputLabel>디스코드 채널</InputLabel>
                    <Select disabled={saving} value={channel} onChange={(e) => setChannel(e.target.value)} variant="standard">
                        {textChannels.map((x, i) => (
                            <MenuItem key={i} value={x.id}>
                                {x.name}
                            </MenuItem>
                        ))}
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

                            const { data } = await axios.put(`/admin/notifications/youtube/${id}`, { channel, script: editorRef.current.getValue() })
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

export default YouTubeEdit
