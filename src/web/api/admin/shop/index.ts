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

router.get('/:id', async (ctx) => {
    const item = await ShopItem.findById(ctx.params.id)

    if (!item) return

    ctx.body = item
})

export default router
