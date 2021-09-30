import './typings'
import { Client } from './structures/client'
import { config } from './config'
import mongoose from 'mongoose'
import { restart, start } from './webManager'
import path from 'path'
import chokidar from 'chokidar'
import { registerAll } from './utils/notification'

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

export const cts = new Client()

let reloading = false

mongoose
    .connect(config.db)
    .then(() => cts.client.login(config.token))
    .then(() => start())
    .then(async () => {
        console.log('Registering subscriptions...')
        await registerAll()
        console.log('Registered subscriptions.')
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
