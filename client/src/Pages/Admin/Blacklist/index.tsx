import React, { useRef } from 'react'
import { axios } from '../../../utils/request'
import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, TextField, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'
import BlacklistList from '../../../components/BlacklistList'
import { useForceUpdate } from '../../../utils/update'
import Editor from '@monaco-editor/react'

const defaultCode = `// await msg.delete() -> 메시지 삭제하기
// 대부분 커스텀 커맨드와 같아요!(카운트 제외)`

const BlacklistListPage: React.FC = () => {
    const [search, setSearch] = React.useState('')

    const [addDialog, setAddDialog] = React.useState(false)

    const [adding, setAdding] = React.useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const history = useHistory()

    const [messages, setMessages] = React.useState<string[]>([])

    const [value, setValue] = React.useState('')

    const update = useForceUpdate()

    const editorRef = useRef<any>(null)

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <Typography variant="h4" fontWeight={700}>
                    검열 관리
                </Typography>
                <div style={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        startIcon={<Add />}
                        onClick={() => {
                            setMessages([])
                            setValue('')
                            setAddDialog(true)
                        }}
                    >
                        검열 트리거 추가하기
                    </Button>
                </Box>
            </Box>
            <Dialog fullScreen open={addDialog} onClose={adding ? () => {} : () => setAddDialog(false)}>
                <DialogTitle>검열 트리거 추가</DialogTitle>
                <DialogContent sx={{ display: 'flex', overflowY: 'hidden', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', maxWidth: '100%' }}>
                        {messages.map((x, i) => (
                            <Chip
                                onDelete={() => {
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
                                const { data } = await axios.post<{ error: string; id: string }>('/admin/blacklist', { trigger: messages, script: editorRef.current.getValue() })
                                console.log(data)
                                if (data.error) {
                                    enqueueSnackbar(data.error, { variant: 'error' })
                                    setAdding(false)
                                    return
                                }
                                history.push(`/admin/blacklist/${data.id}`)
                            } catch (e: any) {
                                if (e.response?.data?.error) {
                                    enqueueSnackbar(e.response.data.error, { variant: 'error' })
                                } else {
                                    enqueueSnackbar(e.message, { variant: 'error' })
                                }
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
                <BlacklistList search={search} />
            </React.Suspense>
        </div>
    )
}

export default BlacklistListPage
