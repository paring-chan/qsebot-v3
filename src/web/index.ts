import Koa from 'koa'
import Router from 'koa-router'
import { config } from '../config'
import koaPassport from 'koa-passport'
import session from 'koa-session'
import redisStore from 'koa-redis'
import connectRedis from 'connect-redis'
import auth from './auth'
import path from 'path'
import Static from 'koa-static'
import api from './api'
import bodyParser from 'koa-bodyparser'
import { pubSubHubbub } from '../websub'
import { ValidationError } from 'yup'
import * as http from 'http'
import express from 'express'
import cookieParser from 'cookie-parser'
import { getMongoExpress } from '../mongoExpress'
import Redis from 'ioredis'
import { IUser, User } from '../models'
import * as fs from 'fs'

const httpServer = http.createServer((req, res) => {
    if (req.url?.startsWith('/admin/db')) {
        return expressApp(req, res)
    }
    return appCallback(req, res)
})

const app = new Koa()

app.keys = [config.web.key]

app.use(bodyParser())

const redisClient = new Redis(config.web.redis)

app.use(
    session(
        {
            httpOnly: true,
            store: redisStore({
                client: redisClient,
            }),
            signed: false,
        },
        app
    )
)

app.use(koaPassport.initialize())

app.use(koaPassport.session())

const publicPath = path.join(__dirname, '../../static')

app.use(Static(publicPath))

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

const expressApp = express()

// expressApp.use(expressSession({ secret: config.web.key, store: new ExpressRedisStore({ client: redisClient }) }))

// expressApp.use(passport.initialize())
//
// expressApp.use(passport.session())

expressApp.use(cookieParser())

getMongoExpress().then((express: any) => {
    expressApp.use(
        '/admin/db',
        async (req, res, next) => {
            const cookie = req.cookies['koa.sess']

            if (!cookie) return res.redirect('/')

            const str = await redisClient.get(cookie)

            if (!str) return res.redirect('/')

            const data = JSON.parse(str)

            const user: IUser | null = await User.findOne({ id: data.passport.user })

            if (!user) return res.redirect('/')

            if (!user.admin) return res.redirect('/')

            return next()
        },
        express
    )
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
                console.log(err)
                ctx.body = { code: ctx.status || 500, message: err.message }
            }
        }
    })
})

const appCallback = app.callback()

export default httpServer
