import './typings'
import { Client } from './structures/client'
import { config } from './config'
import mongoose from 'mongoose'
import { restart, start } from './webManager'
import path from 'path'
import chokidar from 'chokidar'
import { registerAll } from './utils/notification'
import { Logger } from 'tslog'

export const logger = new Logger({ overwriteConsole: true })
process.on('uncaughtException', (d) => logger.error(d))
process.on('unhandledRejection', (d) => logger.error(d))

export const cts = new Client(logger)

let reloading = false

logger.info('Connecting to database')

mongoose
    .connect(config.db)
    .then(() => logger.info('Logging in'))
    .then(() => cts.client.login(config.token))
    .then(() => logger.info('Starting web...'))
    .then(() => start())
    .then(async () => {
        logger.info('Registering subscriptions...')
        await registerAll()
        logger.info('Registered subscriptions.')
        if (config.dev) {
            chokidar.watch(path.join(__dirname, 'web')).on('change', async () => {
                if (reloading) return
                reloading = true
                try {
                    await restart()
                } finally {
                    reloading = false
                }
            })
        }
    })
