import Router from 'koa-router'
import { ShopItem } from '../../../../models/shopItem'
import { shopItemCreateSchema } from './validation'

const router = new Router({ prefix: '/shop' })

router.get('/', async (ctx) => {
    ctx.body = await ShopItem.find()
})

router.post('/', async (ctx) => {
    const data = await shopItemCreateSchema.validate(ctx.request.body)

    const item = new ShopItem()

    item.name = data.name

    await item.save()

    ctx.body = {
        id: item._id,
    }
})

export default router
