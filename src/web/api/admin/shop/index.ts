import Router from 'koa-router'
import { ShopItem } from '../../../../models/shopItem'

const router = new Router({ prefix: '/shop' })

router.get('/', async (ctx) => {
    ctx.body = await ShopItem.find()
})

export default router
