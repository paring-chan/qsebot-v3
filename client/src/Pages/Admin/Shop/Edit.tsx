import React from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Container,
    Dialog,
    FormControlLabel,
    IconButton,
    Slide,
    Stack,
    Switch,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material'
import { useRouteMatch } from 'react-router-dom'
import { axios, useRequest } from '../../../utils/request'
import { useForm, Controller, SubmitHandler, useFieldArray } from 'react-hook-form'
import MDEditor from '@uiw/react-md-editor'
import { yupResolver } from '@hookform/resolvers/yup'
import { shopItemUpdateSchema } from '../../../../../src/web/api/admin/shop/validation'
import { IShopItem, ShopQuestionType } from '../../../../../src/sharedTypings'
import { useSetRecoilState } from 'recoil'
import { adminDisablePaddingState } from '../../../state'
import ShopItem from '../../../components/ShopItem'
import { Close, Delete } from '@mui/icons-material'
import { TransitionProps } from '@mui/material/transitions'
import Layout from '../../../components/Layout'
import { useSnackbar } from 'notistack'
import { LoadingButton } from '@mui/lab'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

const ShopItemEditor: React.FC = () => {
    const {
        params: { id },
    } = useRouteMatch<{ id: string }>()

    const [previewOpen, setPreviewOpen] = React.useState(false)

    const setDisablePadding = useSetRecoilState(adminDisablePaddingState)

    React.useEffect(() => {
        setDisablePadding(true)

        return () => setDisablePadding(false)
    }, [])

    const { data } = useRequest<any>(`/admin/shop/${id}`)

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<IShopItem>({
        defaultValues: data,
        resolver: yupResolver(shopItemUpdateSchema),
    })

    const { enqueueSnackbar } = useSnackbar()

    const submitHandler: SubmitHandler<IShopItem> = async (data) => {
        try {
            await axios.put(`/admin/shop/${id}`, data)
        } catch (e) {
            enqueueSnackbar(`${e}`, {
                variant: 'error',
            })
        }
    }

    const {
        fields: questions,
        append,
        remove,
    } = useFieldArray({
        control: control,
        name: 'questions',
    })

    return (
        <form onSubmit={handleSubmit(submitHandler)} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Dialog TransitionComponent={Transition} open={previewOpen} fullScreen>
                <Toolbar>
                    <Typography variant="h6">프리뷰</Typography>
                    <div style={{ flexGrow: 1 }} />
                    <IconButton onClick={() => setPreviewOpen(false)}>
                        <Close />
                    </IconButton>
                </Toolbar>
                <div style={{ flexGrow: 1, overflow: 'hidden', height: 0 }}>
                    <Layout previewMode>
                        <ShopItem preview item={getValues()} />
                    </Layout>
                </div>
            </Dialog>
            <Container sx={{ flexGrow: 1 }}>
                <Stack direction="column" gap={2} py={2}>
                    <TextField disabled={isSubmitting} label="이름" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
                    <div style={{ pointerEvents: isSubmitting ? 'none' : 'inherit' }}>
                        <Controller control={control} name="desc" render={({ field }) => <MDEditor height={600} onChange={field.onChange} value={field.value} />} />
                    </div>
                    {errors.desc && <Typography color="error">{errors.desc.message}</Typography>}
                    <div>
                        <Accordion>
                            <AccordionSummary>질문</AccordionSummary>
                            <AccordionDetails>
                                {questions.map((x, i) => (
                                    <div key={x.id} style={{ padding: 5 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <TextField
                                                variant="standard"
                                                sx={{
                                                    flexGrow: 1,
                                                }}
                                                placeholder="필드 이름"
                                                {...register(`questions.${i}.name`)}
                                            />
                                            <IconButton
                                                onClick={() => {
                                                    remove(i)
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    fullWidth
                                    onClick={() => {
                                        append({
                                            name: '테스트',
                                            type: ShopQuestionType.TEXT,
                                            data: {},
                                        })
                                    }}
                                >
                                    추가하기
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary>스크립트</AccordionSummary>
                            <AccordionDetails></AccordionDetails>
                        </Accordion>
                    </div>
                </Stack>
            </Container>
            <Stack
                direction="row"
                gap={2}
                position="sticky"
                bottom={0}
                sx={{
                    background: '#fff',
                    borderTop: '1px solid rgba(0,0,0,0.3)',
                    p: 2,
                    zIndex: 1000,
                }}
            >
                <LoadingButton loading={isSubmitting} disableElevation variant="contained" type="submit">
                    저장
                </LoadingButton>
                <LoadingButton
                    loading={isSubmitting}
                    disableElevation
                    variant="outlined"
                    onClick={async () => {
                        try {
                            await shopItemUpdateSchema.validate(getValues())
                            setPreviewOpen(true)
                        } catch (e) {
                            enqueueSnackbar('데이터 검증 실패', { variant: 'error' })
                        }
                    }}
                >
                    프리뷰
                </LoadingButton>
                <FormControlLabel disabled={isSubmitting} control={<Switch disabled={isSubmitting} {...register('isPublished')} />} label="목록 페이지에 표시" />
            </Stack>
        </form>
    )
}

export default ShopItemEditor
