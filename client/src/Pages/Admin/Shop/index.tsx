import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useForm } from 'react-hook-form'

const ShopItemList: React.FC = () => {
    const [createDialog, setCreateDialog] = React.useState(false)

    const createForm = useForm()

    return (
        <Stack direction="column" gap={2}>
            <form>
                <Dialog open={createDialog} fullWidth maxWidth="sm">
                    <DialogTitle>추가하기</DialogTitle>
                    <DialogContent></DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCreateDialog(false)}>취소</Button>
                        <Button>만들기</Button>
                    </DialogActions>
                </Dialog>
            </form>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <Typography variant="h4" fontWeight={600} flexGrow={1}>
                    상점 아이템 관리
                </Typography>
                <IconButton size="small" onClick={() => setCreateDialog(true)}>
                    <Add />
                </IconButton>
            </div>
        </Stack>
    )
}

export default ShopItemList
