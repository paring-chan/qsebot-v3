import Router from 'koa-router'
import { requireAuth } from '../middlewares'
import { ShopItem } from '../../models/shopItem'
import { ShopQuestionType } from '../../sharedTypings'
import { VM } from 'vm2'
import { Context, Middleware } from 'koa'
import { cts } from '../../index'
import { getMainGuild } from '../../utils/guild'
import { getUser } from '../../models'

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
    }).select('-script')

    if (i) {
        ctx.body = i
    }
})

router.post('/:id/purchase', (async (ctx) => {
    const i = await ShopItem.findOne({
        _id: ctx.params.id,
        isPublished: true,
    })

    if (!i) {
        ctx.body = {
            error: 'Item not found',
        }
        ctx.status = 404
        return
    }

    let args: any[] = []

    if (i.questions.length) {
        if (!ctx.request.body.responses || ctx.request.body.responses.length !== i.questions.length) {
            ctx.body = {
                error: 'Validation failed',
            }
            ctx.status = 400
            return
        }
        for (let j = 0; j < i.questions.length; j++) {
            const res = ctx.request.body.responses[j]
            const q = i.questions[j]

            if (res === null || res === undefined) {
                ctx.body = {
                    error: 'Validation failed',
                }
                ctx.status = 400
                return
            }

            switch (q.type) {
                case ShopQuestionType.TEXT:
                    args.push(res)
                    break
                case ShopQuestionType.SELECT:
                    if (!(q as any).options?.includes(res)) {
                        ctx.body = {
                            error: 'Validation failed',
                        }
                        ctx.status = 400
                        return
                    }
                    args.push(res)
                    break
            }
        }
    }

    const user = ctx.state.user.qse
    const qse = await getUser((await getMainGuild().fetchOwner()).user)

    if (user.money >= i.cost) {
        user.money -= i.cost
        qse.money += i.cost

        await user.save()
        await qse.save()
    }

    const vm = new VM({
        sandbox: {
            args,
            user: ctx.state.user.discord,
            client: cts.client,
            cts,
        },
    })

    try {
        await vm.run(`(async () => {
                ${i.script}
            })()`)
    } catch (e) {
        console.error(e)
        user.money += i.cost
        qse.money -= i.cost
        await user.save()
        await qse.save()
        ctx.body = {
            error: '스크립트 실행 실패',
        }
        ctx.status = 500
    }

    ctx.body = {
        ok: 1,
    }
}) as Middleware)

export default router
