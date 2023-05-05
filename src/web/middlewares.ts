import { Middleware } from 'koa'

export const requireAuth: Middleware = (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next()
  }
  ctx.throw(401)
}
export const requireAdmin: Middleware = (ctx, next) => {
  if (ctx.isAuthenticated() || ctx.state.user.qse.admin) {
    return next()
  }
  ctx.throw(401)
}
