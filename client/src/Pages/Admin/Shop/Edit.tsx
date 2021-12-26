import React from 'react'
import { Button, Container, Stack, TextField, Typography } from '@mui/material'
import { useRouteMatch } from 'react-router-dom'
import { useRequest } from '../../../utils/request'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import MDEditor from '@uiw/react-md-editor'
import { yupResolver } from '@hookform/resolvers/yup'
import { shopItemUpdateSchema } from '../../../../../src/web/api/admin/shop/validation'
import { IShopItem } from '../../../../../src/sharedTypings'
import { useSetRecoilState } from 'recoil'
import { adminDisablePaddingState } from '../../../state'

const ShopItemEditor: React.FC = () => {
    const {
        params: { id },
    } = useRouteMatch<{ id: string }>()

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
        formState: { errors },
    } = useForm<IShopItem>({
        defaultValues: data,
        resolver: yupResolver(shopItemUpdateSchema),
    })

    const submitHandler: SubmitHandler<IShopItem> = (data) => {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(submitHandler)} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <Container sx={{ flexGrow: 1 }}>
                <Stack direction="column" gap={2} py={2}>
                    <TextField label="이름" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
                    <Controller control={control} name="desc" render={({ field, fieldState, formState }) => <MDEditor onChange={field.onChange} value={field.value} />} />
                    {errors.desc && <Typography color="error">{errors.desc.message}</Typography>}
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
                <Button disableElevation variant="contained" type="submit">
                    저장
                </Button>
            </Stack>
        </form>
    )
}

export default ShopItemEditor
