import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItemButton, ListItemText, Stack, TextField, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { shopItemCreateSchema } from '../../../../../src/web/api/admin/shop/validation'
import { LoadingButton } from '@mui/lab'
import { axios, useRequest } from '../../../utils/request'
import { useSnackbar } from 'notistack'
import { Link, useHistory } from 'react-router-dom'

type CreateFormData = {
  name: string
}

const ShopItemList: React.FC = () => {
  const [createDialog, setCreateDialog] = React.useState(false)

  const createForm = useForm<CreateFormData>({
    resolver: yupResolver(shopItemCreateSchema),
  })

  const { enqueueSnackbar } = useSnackbar()

  const history = useHistory()

  const submitHandler: SubmitHandler<CreateFormData> = async (data) => {
    try {
      const {
        data: { id },
      } = await axios.post('/admin/shop', data)
      history.push(`/admin/shop/${id}`)
    } catch (e) {
      enqueueSnackbar(`${e}`, {
        variant: 'error',
      })
    }
  }

  const { data } = useRequest<any[]>('/admin/shop')

  return (
    <Stack direction="column" gap={2}>
      <Dialog open={createDialog} fullWidth maxWidth="sm">
        <form onSubmit={createForm.handleSubmit(submitHandler)}>
          <DialogTitle>추가하기</DialogTitle>
          <DialogContent>
            <TextField
              disabled={createForm.formState.isSubmitting}
              error={!!createForm.formState.errors.name}
              helperText={createForm.formState.errors.name?.message}
              label="이름"
              variant="standard"
              fullWidth
              {...createForm.register('name')}
            />
          </DialogContent>
          <DialogActions>
            <LoadingButton loading={createForm.formState.isSubmitting} onClick={() => setCreateDialog(false)}>
              취소
            </LoadingButton>
            <LoadingButton loading={createForm.formState.isSubmitting} type="submit">
              만들기
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
        <Typography variant="h4" fontWeight={600} flexGrow={1}>
          상점 아이템 관리
        </Typography>
        <IconButton size="small" onClick={() => setCreateDialog(true)}>
          <Add />
        </IconButton>
      </div>
      <List>
        {data.map((x, i) => (
          <ListItemButton component={Link} to={`/admin/shop/${x._id}`} key={i}>
            <ListItemText primary={x.name} />
          </ListItemButton>
        ))}
      </List>
    </Stack>
  )
}

export default ShopItemList
