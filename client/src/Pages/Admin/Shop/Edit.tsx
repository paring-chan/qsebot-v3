import React from 'react'
import { useSetRecoilState } from 'recoil'
import { adminDisablePaddingState } from '../../../state'
import { Box, Button, Drawer, Toolbar } from '@mui/material'
import { Menu } from '@mui/icons-material'

const ShopItemEditor: React.FC = () => {
    const setDisablePadding = useSetRecoilState(adminDisablePaddingState)
    const [menu, setMenu] = React.useState(false)

    React.useEffect(() => {
        setDisablePadding(true)
        return () => {
            setDisablePadding(false)
        }
    }, [])

    return (
        <Box sx={{ height: '100%', display: 'flex' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
                <div style={{ color: '#fff', position: 'absolute', right: 10, top: 10 }}>
                    <Button onClick={() => setMenu(!menu)} color="primary" variant="contained">
                        <Menu />
                    </Button>
                </div>
            </div>
            <Drawer onClose={() => setMenu(false)} anchor="right" open={menu} sx={{ width: 240, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' } }}>
                <Toolbar />
                히히
            </Drawer>
        </Box>
    )
}

export default ShopItemEditor
