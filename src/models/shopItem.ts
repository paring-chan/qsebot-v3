import * as mongoose from 'mongoose'
import { ShopQuestionType } from '../sharedTypings'

export interface IShopQuestion {
    name: string
    type: ShopQuestionType
    data: any
}

export interface IShopItem {
    questions: IShopQuestion[]
    name: string
    desc: string
    isPublished: boolean
}

const schema = new mongoose.Schema<IShopItem>({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
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
