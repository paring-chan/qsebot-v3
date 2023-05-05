import Koa from 'koa'
import { Server } from 'http'
import { config } from './config'
import path from 'path'
import koaPassport from 'koa-passport'
import { Profile, Strategy as DiscordStrategy } from 'passport-discord'
import * as oauth2 from 'passport-oauth2'
import { getUser } from './models'
import { cts } from './index'

export let app: Server

export let server: Server

koaPassport.use(
    new DiscordStrategy(
        {
            clientID: config.web.oauth2.clientID,
            clientSecret: config.web.oauth2.clientSecret,
            callbackURL: config.web.oauth2.redirectURI,
            scope: 'identify',
        },
        async (_accessToken: string, _refreshToken: string, _params: any, profile: Profile, done: oauth2.VerifyCallback) => {
            const user = await cts.client.users.fetch(profile.id, { cache: true, force: false })

            done(null, {
                qse: await getUser(user),
                discord: user,
            })
        }
    )
)

koaPassport.serializeUser((user, done) => {
    done(null, user.qse.id)
})

koaPassport.deserializeUser(async (id: string, done) => {
    const user = await cts.client.users.fetch(id, { cache: true, force: false })
    done(null, {
        qse: await getUser(user),
        discord: user,
    })
})

export function start() {
    return new Promise<void>(async (resolve) => {
        console.log('Starting server..')
        app = (await import('./web')).default
        server = app.listen(config.web.port, () => {
            console.log(`Server is listening on port ${config.web.port}`)
            resolve()
        })
    })
}

export function stop() {
    Object.keys(require.cache)
        .filter((x) => x.startsWith(path.join(__dirname, 'web')))
        .forEach((x) => {
            console.log(`Deleting cache: ${x}`)
            delete require.cache[x]
        })
    return new Promise<void>((resolve) => {
        console.log('Stopping server...')
        server.close(() => {
            resolve()
        })
    })
}

export async function restart() {
    await stop()
    await start()
}
