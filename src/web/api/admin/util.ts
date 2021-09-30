import Router from 'koa-router'
import { getMainGuild } from '../../../utils/guild'

const router = new Router()

router.get('/emojis', (ctx) => {
    ctx.body = getMainGuild()
        .emojis.cache.filter((x) => !!x.available)
        .map((x) => ({
            url: x.url,
            str: x.toString(),
            name: x.name,
        }))
})

router.get('/textChannels', (ctx) => {
    ctx.body = getMainGuild()
        .channels.cache.filter((x) => x.type === 'GUILD_TEXT')
        .map((x) => ({
            name: x.name,
            id: x.id,
        }))
})

export default router
