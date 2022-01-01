import React from 'react'
import { useRequest } from '../utils/request'
import { useRouteMatch } from 'react-router-dom'
import ShopItem from '../components/ShopItem'
import { IShopItem } from '../../../src/sharedTypings'

const ShopItemView: React.FC = () => {
    const {
        params: { id },
    } = useRouteMatch<{ id: string }>()

    const { data } = useRequest<IShopItem>(`/shop/${id}`)

    return <ShopItem item={data} />
}

export default ShopItemView
