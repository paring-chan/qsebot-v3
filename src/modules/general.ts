import { listener, Module } from '@pikokr/command.ts'
import { Client } from '../structures/client'

class General extends Module {
    constructor(private cts: Client) {
        super()
    }

    @listener('ready')
    ready() {
        console.log(`Logged in as ${this.cts.client.user!.tag}`)
    }

    @listener('commandError')
    commandError(err: Error) {
        console.error(err)
    }
}

export function install(cts: Client) {
    return new General(cts)
}
