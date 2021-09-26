import Router from 'koa-router'
import { requireAuth } from '../../middlewares'
import { getUser, User } from '../../../models'
import { cts } from '../../../index'

const router = new Router({ prefix: '/admin' })

router.use(requireAuth)

router.get('/admins', async (ctx) => {
    const admins = await User.find({ admin: true })
    ctx.body = await Promise.all(
        (
            await Promise.all(admins.map((x) => cts.client.users.fetch(x.id).catch(() => null))).then((x) => x.filter((y) => y))
        ).map(async (x) => ({
            qse: await getUser(x!),
            discord: x,
        }))
    )
})

export default router
