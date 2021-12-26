import * as mongoose from 'mongoose'
import { IShopItem } from '../sharedTypings'

const schema = new mongoose.Schema<IShopItem>({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        default: '',
    },
    questions: [
        {
            type: Object,
        },
    ],
    isPublished: {
        type: Boolean,
        default: false,
    },
})

export const ShopItem = mongoose.model('shopItem', schema, 'shopItems')
