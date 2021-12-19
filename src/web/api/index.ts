import Router from 'koa-router'
import admin from './admin'
import currency from './currency'

const router = new Router({ prefix: '/api' })

router.use(admin.routes())

router.use(currency.routes())

export default router
