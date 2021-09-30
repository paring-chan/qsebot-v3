import { Module, slashCommand } from '@pikokr/command.ts'
import { pubSubHubbub } from '../websub'
import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

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

    @slashCommand({ command: new SlashCommandBuilder().setName('test').setDescription('test') })
    async test(i: CommandInteraction) {}
}

export function install() {
    return new Notification()
}
