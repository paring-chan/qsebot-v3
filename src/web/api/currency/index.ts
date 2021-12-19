import Router from 'koa-router'
import { User } from '../../../models'
import { cts } from '../../../index'

const router = new Router({ prefix: '/currency' })

router.get('/ranking', async (ctx) => {
    ctx.body = (await User.find().sort({ money: -1 }))
        .filter((x) => x.money > 0)
        .map((x) => ({
            ...x.toJSON(),
            user: cts.client.users.cache.get(x.id),
        }))
        .filter((x) => x.user)
})

export default router
