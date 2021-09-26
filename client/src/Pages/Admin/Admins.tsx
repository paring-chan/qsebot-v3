import React from 'react'
import { axios, useRequest } from '../../utils/request'
import { User } from '../../typings'
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import { Add, Close } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useAccount } from '../../utils/user'

const Admins: React.FC = () => {
    const res = useRequest<User[]>('/admin/admins')
    const data = res.data!
    const me = useAccount()
    const [addDialog, setAddDialog] = React.useState(false)
    const [adding, setAdding] = React.useState(false)
    const [idToAdd, setIdToAdd] = React.useState('')
    const { enqueueSnackbar } = useSnackbar()

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <Typography variant="h4" fontWeight={700}>
                    관리자 목록
                </Typography>
                <div style={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        startIcon={<Add />}
                        onClick={() => {
                            setIdToAdd('')
                            setAddDialog(true)
                        }}
                    >
                        추가하기
                    </Button>
                </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
                <List>
                    {data.map((x, i) => (
                        <ListItem key={i}>
                            <ListItemAvatar>
                                <Avatar src={x.discord.displayAvatarURL} />
                            </ListItemAvatar>
                            <ListItemText primary={x.discord.tag} />
                            <ListItemSecondaryAction>
                                <Tooltip title="관리자 제거">
                                    <IconButton
                                        onClick={async () => {
                                            try {
                                                const { data } = await axios.delete(`/admin/admins/${x.qse.id}`)
                                                if (data.error) {
                                                    enqueueSnackbar(data.error, { variant: 'error' })
                                                    return
                                                }
                                                enqueueSnackbar('관리자가 성공적으로 제거되었습니다.', { variant: 'success' })
                                            } catch (e: any) {
                                                enqueueSnackbar(e.message, { variant: 'error' })
                                            } finally {
                                                await res.mutate()
                                            }
                                        }}
                                        disabled={me.qse.id === x.qse.id}
                                    >
                                        <Close />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Dialog open={addDialog} onClose={adding ? () => {} : () => setAddDialog(false)}>
                <DialogTitle>관리자 추가하기</DialogTitle>
                <DialogContent>
                    <TextField label="추가할 유저 ID" disabled={adding} value={idToAdd} onChange={(e) => setIdToAdd(e.target.value)} variant="standard" />
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={() => setAddDialog(false)} disabled={adding}>
                        취소
                    </Button>
                    <Button
                        color="primary"
                        onClick={async () => {
                            setAdding(true)
                            try {
                                const { data } = await axios.post('/admin/admins', { user: idToAdd })
                                if (data.error) {
                                    enqueueSnackbar(data.error, { variant: 'error' })
                                    return
                                }
                                enqueueSnackbar('관리자가 성공적으로 추가되었습니다.', { variant: 'success' })
                            } catch (e: any) {
                                enqueueSnackbar(e.message, {
                                    variant: 'error',
                                })
                            } finally {
                                await res.mutate()
                                setAddDialog(false)
                                setAdding(false)
                            }
                        }}
                        disabled={adding}
                    >
                        추가하기
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Admins
