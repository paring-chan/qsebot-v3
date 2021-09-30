import { Module } from '@pikokr/command.ts'
import { pubSubHubbub } from '../websub'
import { TextChannel } from 'discord.js'
import xml from 'xml2js'
import { IYoutubeNotification, YoutubeNotification } from '../models'
import { getMainGuild } from '../utils/guild'
import { VM } from 'vm2'

type FeedData = {
    video: {
        id: string
        title: string
        link: string
    }
    channel: {
        id: string
        name: string
        link: string
    }
    published: Date
    updated: Date
}

class Notification extends Module {
    load() {
        pubSubHubbub.on('feed', this.feed)
    }

    async feed(payload: any) {
        const feed = payload.feed.toString()
        const feedData = await xml.parseStringPromise(feed)
        if (feedData.feed['at:deleted-entry']) return
        let body = feedData.feed.entry
        if (!body) return
        body = body[0]
        const data: FeedData = {
            video: {
                id: body['yt:videoId'][0],
                title: body.title[0],
                link: body.link[0].$.href,
            },
            channel: {
                id: body['yt:channelId'][0],
                name: body.author[0].name[0],
                link: body.author[0].uri[0],
            },
            published: new Date(body.published[0]),
            updated: new Date(body.updated[0]),
        }
        const channel: IYoutubeNotification | null = await YoutubeNotification.findOne({ channelId: data.channel.id })
        if (!channel) return
        const dChannel = await getMainGuild()
            .channels.fetch(channel.channel)
            .catch(() => null)
        if (!dChannel || dChannel.type !== 'GUILD_TEXT') return
        try {
            await this.executeScript(channel, dChannel, data)
        } catch (e: any) {
            await dChannel.send(e.message)
        }
    }

    unload() {
        pubSubHubbub.removeListener('feed', this.feed)
    }

    async executeScript(notification: IYoutubeNotification, channel: TextChannel, data: FeedData) {
        const script = notification.script

        const vm = new VM({
            sandbox: {
                channel,
                data,
                importModule: (path: string) => require(path),
            },
        })

        try {
            await vm.run(`(async () => {
                ${script}
            })()`)
        } catch (e) {
            console.error(e)
        }
    }
}

export function install() {
    return new Notification()
}
