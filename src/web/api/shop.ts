import Router from 'koa-router'
import { requireAuth } from '../middlewares'
import { ShopItem } from '../../models/shopItem'

const router = new Router({ prefix: '/shop' })

router.use(requireAuth)

router.get('/', async (ctx) => {
    ctx.body = await ShopItem.find({
        isPublished: true,
    }).select('-script')
})

router.get('/:id', async (ctx) => {
    const i = await ShopItem.findOne({
        _id: ctx.params.id,
        isPublished: true,
    })

    if (i) {
        ctx.body = i
    }
})

export default router
