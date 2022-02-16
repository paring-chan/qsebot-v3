import { applicationCommand, BuiltInModule, command, ownerOnly, rest } from '@pikokr/command.ts'
import { Client } from '../../structures/client'
import { inlineCode, SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, Message } from 'discord.js'
import Dokdo from 'dokdo'
import { config } from '../../config'

class Dev extends BuiltInModule {
    dokdo: Dokdo

    constructor(private cts: Client) {
        super()
        this.dokdo = new Dokdo(this.cts.client, {
            noPerm() {},
            prefix: config.prefix,
            owners: this.cts.owners,
        })
    }

    @applicationCommand({
        command: {
            type: 'CHAT_INPUT',
            name: 'reload',
            description: '리로드',
        },
    })
    @ownerOnly
    async reload(i: CommandInteraction) {
        await i.deferReply()
        const data = await this.cts.registry.reloadAll()
        // await this.cts.registry.syncCommands()
        await i.editReply({
            content: '```\n' + data.map((x) => (x.success ? `✅ ${x.path}` : `❌ ${x.path}\n${x.error}`)).join('\n') + '```',
        })
    }

    @ownerOnly
    @command({ name: '로드' })
    async loadModule(msg: Message, @rest path: string) {
        try {
            await this.cts.registry.loadModule(path, false)
            await msg.react('✅')
        } catch (e: any) {
            await msg.reply(`Error: ${inlineCode(e.message)}`)
        }
    }

    @command()
    dok(msg: Message) {
        return this.dokdo.run(msg)
    }
}

export function install(cts: Client) {
    return new Dev(cts)
}
