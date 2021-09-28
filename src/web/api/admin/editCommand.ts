import Router from 'koa-router'
import { CustomCommand, CustomCommandVariable, ICustomCommand } from '../../../models'
import { CommandCondition } from '../../../sharedTypings'

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

router.put('/', async (ctx) => {
    const body = ctx.request.body
    if (!body.message) return (ctx.body = { error: '메시지는 필수입니다.' })
    if (!body.script) return (ctx.body = { error: '스크립트는 필수입니다.' })
    if (!CommandCondition[body.condition]) return (ctx.body = { error: '알 수 없는 실행 조건입니다.' })

    ctx.command.condition = body.condition

    ctx.command.message = body.message

    ctx.command.script = body.script

    await ctx.command.save()

    ctx.body = { ok: 1 }
})

router.delete('/', async (ctx) => {
    await CustomCommandVariable.deleteMany({
        command: ctx.command._id,
    })
    await ctx.command.delete()
    ctx.body = { ok: 1 }
})

export default router
