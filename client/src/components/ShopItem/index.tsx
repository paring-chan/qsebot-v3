import React from 'react'
import { IShopItem } from '../../../../src/sharedTypings'
import { Button, ListItem, ListItemIcon, ListItemText, styled, Tooltip, Typography } from '@mui/material'
import MDEditor from '@uiw/react-md-editor'
import { Money } from '@mui/icons-material'
import { useAccount } from '../../utils/user'

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

    return (
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
                        <Button variant="outlined">구매하기</Button>
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
    )
}

export default ShopItem
