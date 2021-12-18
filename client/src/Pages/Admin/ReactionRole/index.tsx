import React from 'react'
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Popover,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useGuildRoles, useTextChannels } from '../../../utils/channels'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ReactionRoleType } from '../../../../../src/sharedTypings'
import { yupResolver } from '@hookform/resolvers/yup'
import { reactionRoleCreateSchema } from '../../../../../src/web/api/admin/reactionRole/validation'
import { Controller } from 'react-hook-form'
import { axios, useRequest } from '../../../utils/request'
import { Picker } from 'emoji-mart'
import { useCustomEmojis } from '../../../utils/emojis'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const Item: React.FC<{ item: any; onClick: () => void }> = ({ item, onClick }) => {
    return (
        <ListItem button onClick={onClick}>
            <ListItemText primary={`${item.emoji} ${item.channelName}`} />
            <ListItemSecondaryAction>
                <Box
                    sx={{
                        background: (theme) => theme.palette.primary.main,
                        color: '#fff',
                        display: 'inline',
                        padding: '5px',
                        borderRadius: '5px',
                    }}
                >
                    @{item.name}
                </Box>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

type CreateFormObj = {
    channel: string
    role: string
    id: string
    type: ReactionRoleType
    emoji: string
}

const ReactionRoleList: React.FC = () => {
    const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
    const [error, setError] = React.useState('')
    const [emojiSelector, setEmojiSelector] = React.useState<HTMLDivElement | null>(null)

    const textChannels = useTextChannels()
    const roles = useGuildRoles()
    const emojiList = useCustomEmojis()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<CreateFormObj>({
        defaultValues: {
            role: roles[0].id,
            channel: textChannels[0].id,
            type: ReactionRoleType.GIVE,
            id: '',
            emoji: '',
        },
        resolver: yupResolver(reactionRoleCreateSchema),
    })

    const { data, mutate } = useRequest<any[]>('/admin/reactionRole')

    const submit: SubmitHandler<CreateFormObj> = async (data) => {
        setError('')
        try {
            await axios.post('/admin/reactionRole', data)

            setCreateDialogOpen(false)

            return mutate()
        } catch (e) {
            if (e.response.data?.error) {
                setError(e.response.data.error)
            }
        }
    }

    const [itemToDelete, setItemToDelete] = React.useState<null | string>(null)
    const [deleting, setDeleting] = React.useState<boolean>(false)
    const { enqueueSnackbar } = useSnackbar()

    return (
        <div>
            <Dialog open={!!itemToDelete}>
                <DialogTitle>삭제하기</DialogTitle>
                <DialogContent>아이템을 삭제할까요?</DialogContent>
                <DialogActions>
                    <Button color="primary" disabled={deleting} onClick={() => setItemToDelete(null)}>
                        취소하기
                    </Button>
                    <Button
                        color="error"
                        disabled={deleting}
                        onClick={async () => {
                            try {
                                setDeleting(true)
                                await axios.delete(`/admin/reactionRole/${itemToDelete}`)
                                enqueueSnackbar('삭제 성공', {
                                    variant: 'success',
                                })
                                setItemToDelete(null)
                                return mutate()
                            } catch (e) {
                                enqueueSnackbar('삭제 실패', {
                                    variant: 'error',
                                })
                            } finally {
                                setDeleting(false)
                            }
                        }}
                    >
                        삭제하기
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={createDialogOpen} fullWidth maxWidth="sm">
                <form onSubmit={handleSubmit(submit)}>
                    <DialogTitle>추가하기</DialogTitle>
                    <DialogContent>
                        <Stack gap={2}>
                            {error && <Alert severity="error">{error}</Alert>}
                            <div>
                                <Typography>채널</Typography>
                                <Controller
                                    name="channel"
                                    control={control}
                                    render={({ field: { ref, onChange } }) => (
                                        <Select disabled={isSubmitting} variant="standard" ref={ref} onChange={onChange} fullWidth defaultValue={textChannels[0].id}>
                                            {textChannels.map((x, i) => (
                                                <MenuItem key={i} value={x.id}>
                                                    {x.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.channel && <Typography color="error">{errors.channel.message}</Typography>}
                            </div>
                            <div>
                                <Typography>타입</Typography>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field: { ref, onChange } }) => (
                                        <Select disabled={isSubmitting} variant="standard" ref={ref} onChange={onChange} fullWidth defaultValue={ReactionRoleType.GIVE}>
                                            <MenuItem value={ReactionRoleType.MULTI}>Multi</MenuItem>
                                            <MenuItem value={ReactionRoleType.GIVE}>Give</MenuItem>
                                            <MenuItem value={ReactionRoleType.REMOVE}>Remove</MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors.channel && <Typography color="error">{errors.channel.message}</Typography>}
                            </div>
                            <TextField
                                disabled={isSubmitting}
                                variant="standard"
                                label="메시지 ID"
                                error={!!errors.id}
                                helperText={errors.id?.message}
                                inputProps={register('id')}
                            />
                            <div>
                                <Typography>역할</Typography>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field: { ref, onChange } }) => (
                                        <Select disabled={isSubmitting} error={!!errors.role} variant="standard" ref={ref} onChange={onChange} fullWidth defaultValue={roles[0].id}>
                                            {roles.map((x, i) => (
                                                <MenuItem key={i} value={x.id}>
                                                    {x.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                {errors.role && <Typography color="error">{errors.role.message}</Typography>}
                            </div>
                            <TextField
                                disabled={isSubmitting}
                                variant="standard"
                                placeholder="이모지"
                                error={!!errors.emoji}
                                helperText={errors.emoji?.message}
                                {...register('emoji')}
                                InputProps={{
                                    readOnly: true,
                                }}
                                onClick={(e) => {
                                    setEmojiSelector(e.currentTarget)
                                }}
                            />
                            <Popover onClose={() => setEmojiSelector(null)} open={!!emojiSelector} anchorEl={emojiSelector}>
                                <Picker
                                    onSelect={(emoji) => {
                                        setValue('emoji', emojiList.find((x) => x.name === emoji.id)?.id || (emoji as any).native)

                                        setEmojiSelector(null)
                                    }}
                                    custom={emojiList}
                                />
                            </Popover>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={isSubmitting} onClick={() => setCreateDialogOpen(false)} color="error">
                            닫기
                        </Button>
                        <Button disabled={isSubmitting} type="submit">
                            추가하기
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <Typography variant="h4" flexGrow={1} fontWeight={700}>
                    역할지급 관리
                </Typography>
                <TextField variant="standard" label="검색" />
                <IconButton size="small" onClick={() => setCreateDialogOpen(true)}>
                    <Add />
                </IconButton>
            </div>
            <List>
                {data.map((x, i) => (
                    <Item onClick={() => setItemToDelete(x.id)} key={i} item={x} />
                ))}
            </List>
        </div>
    )
}

export default ReactionRoleList
