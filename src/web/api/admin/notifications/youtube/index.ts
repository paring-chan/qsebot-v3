import Router from 'koa-router'
import { YoutubeNotification } from '../../../../../models'
import { escapeRegexp } from '../../../../../utils/regexp'

const router = new Router({ prefix: '/youtube' })

const amount = 20

router.get('/', async (ctx) => {
    let page = Number(ctx.query.page)

    const count = await YoutubeNotification.count({ message: { $regex: escapeRegexp(ctx.query.search as string) } })
    ctx.body = {
        data: await YoutubeNotification.find({ message: { $regex: escapeRegexp(ctx.query.search as string) } }, [], { skip: amount * (page - 1), limit: amount }),
        pages: Math.ceil(count / amount) || 1,
    }
})

export default router
