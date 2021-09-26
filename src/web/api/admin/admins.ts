import Router from 'koa-router'
import { getUser, User } from '../../../models'
import { cts } from '../../../index'

const router = new Router()

router.get('/admins', async (ctx) => {
    const admins = await User.find({ admin: true })
    ctx.body = await Promise.all(
        (
            await Promise.all(admins.map((x) => cts.client.users.fetch(x.id, { cache: true }).catch(() => null))).then((x) => x.filter((y) => y))
        ).map(async (x) => ({
            qse: await getUser(x!),
            discord: x,
        }))
    )
})

router.delete('/admins/:id', async (ctx) => {
    const id = ctx.params.id
    if (id === ctx.state.user.qse.id) return (ctx.body = { error: '자신의 관리자를 제거할 수 없습니다' })
    const userToRemoveAdmin = await User.findOne({ id, admin: true })
    if (!userToRemoveAdmin) {
        return (ctx.body = {
            error: '유저가 관리자가 아닙니다.',
        })
    }
    userToRemoveAdmin.admin = false
    await userToRemoveAdmin.save()
    ctx.body = {
        ok: 1,
    }
})

router.post('/admins', async (ctx) => {
    const body = ctx.request.body
    if (!body.user) {
        return (ctx.body = { error: 'ID는 필수입니다.' })
    }
    const user = await cts.client.users.fetch(body.user).catch(() => null)
    if (!user) {
        return (ctx.body = { error: '해당 아이디의 디스코드 유저가 존재하지 않습니다.' })
    }
    if (await User.findOne({ id: body.id, admin: true })) {
        return (ctx.body = { error: '이미 관리자 목록에 추가된 유저입니다.' })
    }
    const u = await getUser(user)

    u.admin = true

    await u.save()

    ctx.body = { ok: 1 }
})

export default router
