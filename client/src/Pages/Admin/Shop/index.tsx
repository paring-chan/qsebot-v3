import React from 'react'
import { IconButton, Stack, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'

const ShopItemList: React.FC = () => {
    return (
        <Stack direction="column" gap={2}>
            <Stack gap={2} direction="row">
                <Typography variant="h4" fontWeight={600} flexGrow={1}>
                    상점 아이템 관리
                </Typography>
                <IconButton size="small">
                    <Add />
                </IconButton>
            </Stack>
        </Stack>
    )
}

export default ShopItemList
