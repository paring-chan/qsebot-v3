import React from 'react'
import { IShopItem, ShopQuestionType } from '../../../../src/sharedTypings'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    styled,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
} from '@mui/material'
import MDEditor from '@uiw/react-md-editor'
import { Money } from '@mui/icons-material'
import { useAccount } from '../../utils/user'
import { useForm, Controller } from 'react-hook-form'
import { axios } from '../../utils/request'
import { useSnackbar } from 'notistack'
import { useReloadUser } from '../../state'

const ItemContainer = styled('div')({
    display: 'flex',
    paddingBottom: 20,
    gap: 10,
    '@media screen and (max-width: 1024px)': {
        flexDirection: 'column-reverse',
    },
})

const RightArea = styled('div')({
    minWidth: 240,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    overflowY: 'auto',
    position: 'sticky',
    top: 20,
})

const RightCard = styled('div')({
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 5,
})

const CostText = styled('div')({
    display: 'flex',
    gap: 10,
    alignItems: 'center',
})

const ShopItem: React.FC<{ item: IShopItem; preview?: boolean }> = ({ item, preview }) => {
    const user = useAccount()

    const reloadUser = useReloadUser()

    const mobile = useMediaQuery('(max-width: 1024px)')

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
        reset,
    } = useForm()

    const { enqueueSnackbar } = useSnackbar()

    const [purchaseDialog, setPurchaseDialog] = React.useState(false)

    return (
        <>
            <Dialog open={purchaseDialog} fullWidth maxWidth="md">
                <form
                    onSubmit={handleSubmit(async (data) => {
                        await axios
                            .post(`/shop/${(item as any)._id}/purchase`, data)
                            .then(() => {
                                enqueueSnackbar('정상적으로 처리되었습니다.', {
                                    variant: 'success',
                                })
                                reloadUser()
                                reset()
                                setPurchaseDialog(false)
                            })
                            .catch((x) => {
                                if (x.response?.data?.error) {
                                    enqueueSnackbar(x.response.data.error, {
                                        variant: 'error',
                                    })
                                    return
                                }
                                enqueueSnackbar(`${x}`, {
                                    variant: 'error',
                                })
                            })
                    })}
                >
                    <DialogTitle>{item.name} 구매하기</DialogTitle>
                    <DialogContent>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '10px',
                                flexDirection: mobile ? 'column' : 'row',
                            }}
                        >
                            <div style={{ flexGrow: 1 }}>
                                {item.questions.map((x, i) => (
                                    <Controller
                                        key={i}
                                        control={control}
                                        name={`responses.${i}`}
                                        render={({ field }) => {
                                            switch (x.type) {
                                                case ShopQuestionType.TEXT:
                                                    return <TextField required sx={{ mt: 2 }} disabled={isSubmitting} variant="standard" fullWidth {...field} label={x.name} />
                                                case ShopQuestionType.SELECT:
                                                    return (
                                                        <FormControl sx={{ mt: 2 }} variant="standard" fullWidth>
                                                            <InputLabel>{x.name}</InputLabel>
                                                            <Select disabled={isSubmitting} required variant="standard" {...field} value={field.value || ''}>
                                                                {((x as any).options || ([] as string[])).map((y, j) => (
                                                                    <MenuItem value={y} key={j}>
                                                                        {y}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )
                                                default:
                                                    return <div />
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                            <Stack direction="column" gap={2} alignItems="flex-end">
                                <div>가격: ${item.cost}</div>
                                <div>현재 보유중: ${user.qse.money}</div>
                                <div>구매 후 남을 돈: ${user.qse.money - item.cost}</div>
                            </Stack>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                reset()
                                setPurchaseDialog(false)
                            }}
                            disabled={isSubmitting}
                        >
                            취소하기
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            구매하기
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <ItemContainer>
                <div style={{ flexGrow: 1 }}>
                    <MDEditor.Markdown source={item.desc} />
                </div>
                <div>
                    <RightArea>
                        <RightCard>
                            <Typography variant="h6">{item.name}</Typography>

                            <CostText>
                                <Money />
                                <ListItemText primary={item.cost} />
                            </CostText>
                        </RightCard>
                        {preview ? (
                            <Tooltip title="프리뷰 모드입니다.">
                                <span>
                                    <Button variant="outlined" disabled fullWidth>
                                        구매하기
                                    </Button>
                                </span>
                            </Tooltip>
                        ) : user.qse.money >= item.cost ? (
                            <Button variant="outlined" onClick={() => setPurchaseDialog(true)}>
                                구매하기
                            </Button>
                        ) : (
                            <Tooltip title="돈이 부족합니다.">
                                <span>
                                    <Button variant="outlined" disabled fullWidth>
                                        구매하기
                                    </Button>
                                </span>
                            </Tooltip>
                        )}
                    </RightArea>
                </div>
            </ItemContainer>
        </>
    )
}

export default ShopItem
