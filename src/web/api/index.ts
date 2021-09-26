import Router from 'koa-router'
import admin from './admin'

const router = new Router({ prefix: '/api' })

router.use(admin.routes())

export default router
