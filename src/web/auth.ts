import Router from 'koa-router'
import koaPassport from 'koa-passport'

const router = new Router({ prefix: '/auth' })

router.get(
    '/login',
    koaPassport.authenticate('discord', {
        successRedirect: '/',
        failureRedirect: '/',
    })
)

export default router
