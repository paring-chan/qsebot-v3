import Router from 'koa-router'
import koaPassport from 'koa-passport'
import { Middleware } from 'koa'

const router = new Router({ prefix: '/auth' })

router.get(
    '/login',
    koaPassport.authenticate('discord', {
        successRedirect: '/',
        failureRedirect: '/',
    })
)

router.get('/logout', (ctx) => {
    ctx.logout()
    ctx.redirect('/')
})

router.get('/current', (ctx) => {
    ctx.body = ctx.state.user || null
})

export default router
