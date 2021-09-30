import { listener, Module } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { GuildMember } from 'discord.js'
import { config } from '../config'

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

    @listener('slashCommandError')
    slashCommandError(err: Error) {
        console.error(err)
    }

    @listener('guildMemberAdd')
    async join(member: GuildMember) {
        if (member.user.bot) return
        if (member.guild.id !== config.mainGuildId) return
        await member.roles.add(config.roleId)
    }
}

export function install(cts: Client) {
    return new General(cts)
}
