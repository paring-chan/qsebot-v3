import { Module } from '@pikokr/command.ts'
import { pubSubHubbub } from '../websub'

class Notification extends Module {
    load() {
        pubSubHubbub.on('feed', this.feed)
    }

    feed(data: any) {
        console.log(data.feed.toString())
    }

    unload() {
        pubSubHubbub.removeListener('feed', this.feed)
    }
}

export function install() {
    return new Notification()
}
