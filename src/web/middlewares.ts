import { Middleware } from 'koa'
import { IMiddleware } from 'koa-router'

export const requireAuth: IMiddleware = (ctx, next) => {
    if (ctx.isAuthenticated()) {
        return next()
    }
    ctx.throw(401)
}
export const requireAdmin: IMiddleware = (ctx, next) => {
    if (ctx.isAuthenticated() || ctx.state.user.qse.admin) {
        return next()
    }
    ctx.throw(401)
}
