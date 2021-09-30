import Router from 'koa-router'
import yt from './youtube'

const router = new Router({ prefix: '/notifications' })

router.use(yt.routes())

export default router
