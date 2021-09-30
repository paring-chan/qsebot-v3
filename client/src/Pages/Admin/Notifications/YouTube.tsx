import React, { useRef } from 'react'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import Editor from '@monaco-editor/react'
import { axios } from '../../../utils/request'
import YTNotificationList from '../../../components/YTNotificationList'
import { useTextChannels } from '../../../utils/channels'

const defaultCode = `// await channel.send('내용') -> 메시지 보내기
// channel -> 디스코드 채널
// video -> 영상 데이터
`

const YouTubeNotifications: React.FC = () => {
    const [search, setSearch] = React.useState('')

    const [addDialog, setAddDialog] = React.useState(false)

    const [ytChannel, setYTChannel] = React.useState('')

    const [adding, setAdding] = React.useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const [channel, setChannel] = React.useState('')

    const history = useHistory()

    const editorRef = useRef<any>(null)

    const textChannels = useTextChannels()

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <Typography variant="h4" fontWeight={700}>
                    유튜브 알림 관리
                </Typography>
                <div style={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        startIcon={<Add />}
                        onClick={() => {
                            setChannel('')
                            setAddDialog(true)
                        }}
                    >
                        알림 추가하기
                    </Button>
                </Box>
            </Box>
            <Dialog fullScreen open={addDialog} onClose={adding ? () => {} : () => setAddDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>알림 추가</DialogTitle>
                <DialogContent sx={{ display: 'flex', overflowY: 'hidden', flexDirection: 'column', gap: 2 }}>
                    <TextField value={ytChannel} fullWidth onChange={(e) => setYTChannel(e.target.value)} label="유튜브 채널 ID" multiline variant="standard" />
                    <FormControl variant="standard" fullWidth>
                        <InputLabel>디스코드 채널</InputLabel>
                        <Select value={channel} onChange={(e) => setChannel(e.target.value)} variant="standard">
                            {textChannels.map((x, i) => (
                                <MenuItem key={i} value={x.id}>
                                    {x.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Paper variant="outlined" sx={{ flexGrow: 1 }}>
                        <Editor
                            onMount={(editor) => {
                                editorRef.current = editor
                            }}
                            height="100%"
                            defaultLanguage="javascript"
                            defaultValue={defaultCode}
                        />
                    </Paper>
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
                                const { data } = await axios.post<{ error: string; id: string }>('/admin/notifications/youtube', {
                                    ytChannel: '',
                                    channel,
                                    script: editorRef.current.getValue(),
                                })
                                if (data.error) {
                                    enqueueSnackbar(data.error, { variant: 'error' })
                                    setAdding(false)
                                    return
                                }
                                history.push(`/admin/notifications/youtube/${data.id}`)
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
                <YTNotificationList search={search} />
            </React.Suspense>
        </div>
    )
}

export default YouTubeNotifications
