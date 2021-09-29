import './typings'
import { Client } from './structures/client'
import { config } from './config'
import mongoose from 'mongoose'
import { restart, start } from './webManager'
import path from 'path'
import chokidar from 'chokidar'
import { pubSubHubbub } from './websub'

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

export const cts = new Client()

let reloading = false

mongoose
    .connect(config.db)
    // .then(() => cts.client.login(config.token))
    .then(() => start())
    .then(() => {
        pubSubHubbub.subscribe('https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCxCM_7aAiLo4uXFuV1pTBuw', 'https://pubsubhubbub.appspot.com/')
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
