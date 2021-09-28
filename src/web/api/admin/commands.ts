import Router from 'koa-router'
import { CustomCommand } from '../../../models'

const router = new Router({ prefix: '/commands' })

const amount = 20

router.get('/', async (ctx) => {
    let page = Number(ctx.query.page)

    const count = await CustomCommand.count({ message: { $regex: new RegExp(ctx.query.search as string, 'i') } })
    ctx.body = {
        data: await CustomCommand.find({ message: { $regex: new RegExp(ctx.query.search as string, 'i') } }, [], { skip: amount * (page - 1), limit: amount }),
        pages: Math.ceil(count / amount) || 1,
    }
})

export default router
