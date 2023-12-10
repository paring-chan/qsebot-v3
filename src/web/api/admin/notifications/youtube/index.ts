import Router, { IMiddleware } from 'koa-router'
import { YoutubeNotification } from '../../../../../models'
import { escapeRegexp } from '../../../../../utils/regexp'
import { cts } from '../../../../../index'
import { registerAll, unregisterAll } from '../../../../../utils/notification'
import edit from './edit'

const router = new Router({ prefix: '/youtube' })

const amount = 20

router.use(edit.routes() as IMiddleware)

router.get('/', async (ctx) => {
    let page = Number(ctx.query.page)

    const count = await YoutubeNotification.count({ message: { $regex: escapeRegexp(ctx.query.search as string) } })
    ctx.body = {
        data: await YoutubeNotification.find({ message: { $regex: escapeRegexp(ctx.query.search as string) } }, [], { skip: amount * (page - 1), limit: amount }),
        pages: Math.ceil(count / amount) || 1,
    }
})

router.post('/', async (ctx) => {
    const body = ctx.request.body as any
    if (!body.ytChannel) return (ctx.body = { error: '유튜브 채널은 필수입니다.' })
    if (!body.channel) return (ctx.body = { error: '디스코드 채널은 필수입니다.' })
    if (!body.script) return (ctx.body = { error: '스크립트는 필수입니다.' })

    const channel = cts.client.channels.cache.find((x) => x.id === body.channel && x.type === 'GUILD_TEXT')

    if (!channel) return (ctx.body = { error: '알 수 없는 채널입니다.' })

    const notification = new YoutubeNotification()

    notification.channel = body.channel

    notification.script = body.script

    notification.channelId = body.ytChannel

    await unregisterAll()

    await notification.save()

    await registerAll()

    ctx.body = { ok: 1, id: notification._id }
})

export default router
