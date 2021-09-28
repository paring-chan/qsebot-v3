import Router from 'koa-router'
import { CustomCommand, ICustomCommand } from '../../../models'

const router = new Router({ prefix: '/:id' })

declare module 'koa' {
    interface BaseContext {
        command: ICustomCommand
    }
}

router.use(async (ctx, next) => {
    const id = ctx.params.id

    const quiz = await CustomCommand.findById(id)

    if (!quiz) return ctx.throw(404)

    ctx.command = quiz

    return next()
})

router.get('/', (ctx) => (ctx.body = ctx.command))

export default router
