import React from 'react'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import { axios } from '../../../utils/request'
import CommandList from '../../../components/CommandList'
import { CommandCondition } from '../../../../../src/sharedTypings'

const CustomCommands: React.FC = () => {
    const [search, setSearch] = React.useState('')

    const [addDialog, setAddDialog] = React.useState(false)

    const [adding, setAdding] = React.useState(false)

    const { enqueueSnackbar } = useSnackbar()

    const history = useHistory()

    const [message, setMessage] = React.useState('')
    const [condition, setCondition] = React.useState<CommandCondition>(CommandCondition.EQUALS)

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <Typography variant="h4" fontWeight={700}>
                    커스텀 커맨드 관리
                </Typography>
                <div style={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        startIcon={<Add />}
                        onClick={() => {
                            setMessage('')
                            setCondition(CommandCondition.EQUALS)
                            setAddDialog(true)
                        }}
                    >
                        커맨드 추가하기
                    </Button>
                </Box>
            </Box>
            <Dialog open={addDialog} onClose={adding ? () => {} : () => setAddDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>커맨드 추가</DialogTitle>
                <DialogContent>
                    <TextField value={message} fullWidth onChange={(e) => setMessage(e.target.value)} label="메시지 내용" multiline variant="standard" />
                    <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                        <InputLabel>실행 조건</InputLabel>
                        <Select value={condition} onChange={(e) => setCondition(e.target.value as CommandCondition)} variant="standard">
                            <MenuItem value={CommandCondition.EQUALS}>EQUALS</MenuItem>
                            <MenuItem value={CommandCondition.CONTAINS}>CONTAINS</MenuItem>
                            <MenuItem value={CommandCondition.STARTS_WITH}>STARTS_WITH</MenuItem>
                            <MenuItem value={CommandCondition.ENDS_WITH}>ENDS_WITH</MenuItem>
                            <MenuItem value={CommandCondition.REGEXP}>REGEXP</MenuItem>
                        </Select>
                    </FormControl>
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
                                const { data } = await axios.post<{ error: string; id: string }>('/admin/commands', { question: message })
                                if (data.error) {
                                    enqueueSnackbar(data.error, { variant: 'error' })
                                    setAdding(false)
                                    return
                                }
                                history.push(`/admin/commands/${data.id}`)
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
                <CommandList search={search} />
            </React.Suspense>
        </div>
    )
}

export default CustomCommands
