import Koa from 'koa'
import Router from 'koa-router'
import { config } from '../config'
import koaPassport from 'koa-passport'
import session from 'koa-session'
import redisStore from 'koa-redis'
import auth from './auth'
import path from 'path'
import * as fs from 'fs'
import Static from 'koa-static'
import api from './api'
import bodyParser from 'koa-bodyparser'
import { pubSubHubbub } from '../websub'
import { ValidationError } from 'yup'

const app = new Koa()

app.keys = [config.web.key]

app.use(bodyParser())

app.use(session({ httpOnly: true, store: redisStore(config.web.redis) }, app))

app.use(koaPassport.initialize())

app.use(koaPassport.session())

const publicPath = path.join(__dirname, '../../static')

app.use(Static(publicPath))

app.use(async (ctx, next) => {
    try {
        await next()
        const status = ctx.status || 404
        if (status === 404) {
            ctx.throw(404)
        }
    } catch (err: any) {
        ctx.status = err.status || 500
        if (err instanceof ValidationError) {
            ctx.status = 200
            ctx.body = { error: err.message, code: 200 }
            return
        }
        if (ctx.status === 404) {
            if (ctx.path.startsWith('/api')) {
                ctx.body = {
                    code: 404,
                    error: 'Page not found.',
                }
            } else {
                ctx.status = 200
                ctx.body = (await fs.promises.readFile(path.join(publicPath, 'index.html'))).toString()
            }
        } else {
            ctx.body = { code: ctx.status || 500, message: err.message }
        }
    }
})

const router = new Router()

const sub = pubSubHubbub.listener()

router.all('/pubsubhubbub', (ctx) => {
    ctx.status = 200

    const promise = new Promise<void>((resolve) => {
        const end = ctx.res.end.bind(ctx.res)
        ctx.res.end = (cb) => {
            resolve()
            return end(cb)
        }
    })

    try {
        sub(ctx.req, ctx.res)
    } catch (e: any) {
        console.error(e)
    }

    return promise
})

router.use(auth.routes())

router.use(api.routes())

app.use(router.routes())

export default app
