import Router from 'koa-router'
import admin from './admin'
import currency from './currency'
import shop from './shop'

const router = new Router({ prefix: '/api' })

router.use(admin.routes())

router.use(currency.routes())

router.use(shop.routes())

export default router
