import Router from 'koa-router'
import { reactionRoleCreateSchema } from './validation'
import { getMainGuild } from '../../../../utils/guild'
import { ReactionRole } from '../../../../models'

const router = new Router({
    prefix: '/reactionRole',
})

router.get('/', async (ctx) => {
    ctx.body = (await ReactionRole.find()).map((data: any) => ({
        id: data.id,
        emoji: data.emoji,
        type: data.type,
        name: getMainGuild().roles.cache.get(data.roleId)?.name || 'UNKNOWN',
        channelName: getMainGuild().channels.cache.get(data.channel)?.name || 'UNKNOWN CHANNEL',
    }))
})

router.delete('/:id', async (ctx) => {
    const item = await ReactionRole.findById(ctx.params.id)
    console.log(item)
    if (!item) {
        ctx.status = 404
        ctx.body = { error: 'not found' }
        return
    }
    await item.delete()
    ctx.body = { success: true }
})

router.post('/', async (ctx) => {
    const data = await reactionRoleCreateSchema.validate(ctx.request.body)

    const chn = await getMainGuild().channels.cache.get(data.channel)

    if (!chn || !chn.isText()) {
        ctx.status = 400

        ctx.body = {
            error: 'Channel Not Found',
        }
        return
    }

    const msg = await chn.messages.fetch(data.id).catch(() => null)

    if (!msg) {
        ctx.status = 400

        ctx.body = {
            error: 'Message not found',
        }
        return
    }

    const role = getMainGuild().roles.cache.get(data.role)

    if (!role) {
        ctx.status = 400
        ctx.body = {
            error: 'Role not found',
        }
        return
    }

    const item = new ReactionRole()

    item.messageId = data.id

    item.type = data.type

    item.emoji = data.emoji

    item.roleId = data.role

    item.channel = data.channel

    await msg.react(data.emoji)

    await item.save()

    ctx.body = { id: item._id }
})

export default router
