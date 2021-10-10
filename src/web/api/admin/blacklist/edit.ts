import Router from 'koa-router'
import { Blacklist, IBlackList } from '../../../../models'
import { blacklistSchema } from './index'

const router = new Router({ prefix: '/:id' })

declare module 'koa' {
    interface BaseContext {
        blacklist: IBlackList
    }
}

router.use(async (ctx, next) => {
    const id = ctx.params.id

    const item = await Blacklist.findById(id)

    if (!item) return ctx.throw(404)

    ctx.blacklist = item

    return next()
})

router.put('/', async (ctx) => {
    const body = await blacklistSchema.validate(ctx.request.body)

    ctx.blacklist.trigger = body.trigger

    ctx.blacklist.script = body.script

    await ctx.blacklist.save()

    ctx.body = { ok: 1 }
})

router.delete('/', async (ctx) => {
    await ctx.blacklist.delete()

    ctx.body = { ok: 1 }
})

router.get('/', (ctx) => {
    ctx.body = ctx.blacklist
})

export default router
