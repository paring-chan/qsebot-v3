import React from 'react'
import { useRequest } from '../utils/request'
import { List, ListItemButton, ListItemText } from '@mui/material'
import { IShopItem } from '../../../src/sharedTypings'
import { Link } from 'react-router-dom'

const Shop: React.FC = () => {
    const { data } = useRequest<IShopItem[]>('/shop')

    return (
        <div>
            <List>
                {data.map((x, i) => (
                    <ListItemButton component={Link} to={`/shop/${(x as any)._id}`} key={i}>
                        <ListItemText primary={x.name} secondary={`$${x.cost}`} />
                    </ListItemButton>
                ))}
            </List>
        </div>
    )
}

export default Shop
