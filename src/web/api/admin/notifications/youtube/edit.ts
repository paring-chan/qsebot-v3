import Router from 'koa-router'
import { IYoutubeNotification, YoutubeNotification } from '../../../../../models'
import { cts } from '../../../../../index'

const router = new Router({ prefix: '/:id' })

declare module 'koa' {
    interface BaseContext {
        ytNotification: IYoutubeNotification
    }
}

router.use(async (ctx, next) => {
    const id = ctx.params.id

    const notification = await YoutubeNotification.findById(id)

    if (!notification) return ctx.throw(404)

    ctx.ytNotification = notification

    return next()
})

router.put('/', async (ctx) => {
    const body = ctx.request.body
    if (!body.channel) return (ctx.body = { error: '채널은 필수입니다.' })
    if (!body.script) return (ctx.body = { error: '스크립트는 필수입니다.' })

    const channel = cts.client.channels.cache.find((x) => x.id === body.channel && x.type === 'GUILD_TEXT')

    if (!channel) return (ctx.body = { error: '알 수 없는 채널입니다.' })

    ctx.ytNotification.channel = channel.id

    ctx.ytNotification.script = body.script

    await ctx.command.save()

    ctx.body = { ok: 1 }
})

router.delete('/', async (ctx) => {
    await ctx.ytNotification.delete()

    ctx.body = { ok: 1 }
})

router.get('/', (ctx) => {
    ctx.body = ctx.ytNotification
})

export default router
