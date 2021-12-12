import { command, Module, requireUserPermissions } from '@pikokr/command.ts'
import { GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { codeBlock } from '@discordjs/builders'

class Moderation extends Module {
    @command({ name: 'banwave' })
    @requireUserPermissions('ADMINISTRATOR')
    async banWave(msg: Message, from: string, to: string) {
        let firstMsg = (
            await msg.channel.messages.fetch({
                limit: 3,
                around: from,
            })
        ).last()

        if (!firstMsg) return

        const lastMsg = await msg.channel.messages.fetch(to)

        const after = await msg.channel.messages.fetch({
            after: firstMsg.id,
            limit: 100,
        })

        if (!after.get(lastMsg.id)) return msg.reply('메시지 개수가 100개를 초과합니다아')
        const messages = after.filter((x) => x.createdTimestamp >= firstMsg!.createdTimestamp && x.createdTimestamp <= lastMsg.createdTimestamp)
        const users = Array.from(new Set(messages.map((x) => x.member).filter((x) => x instanceof GuildMember && !x.user.bot))) as GuildMember[]

        const m = await msg.channel.send({
            content: `${users.length}명의 유저를 차단합니다. 진행할까요?\n${codeBlock('diff', `${users.map((x) => `- ${x.user.tag}`).join('\n')}`)}`,
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton({
                        customId: 'confirm',
                        style: 'DANGER',
                        label: '차단',
                    }),
                    new MessageButton({
                        customId: 'cancel',
                        style: 'SUCCESS',
                        label: '취소',
                    })
                ),
            ],
        })

        try {
            const i = await m.awaitMessageComponent({
                filter: async (x) => {
                    await x.deferUpdate()
                    return x.user.id === msg.author.id
                },
                time: 15000,
            })

            if (i.customId !== 'confirm') return msg.reply('취소되었습니다.')
        } catch (e) {
            return msg.reply('Timed Out')
        } finally {
            await m.edit({
                components: [
                    new MessageActionRow({
                        components: m.components[0].components.map((x) => x.setDisabled(true)),
                    }),
                ],
            })
        }

        for (const user of users) {
            await user.user.send({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`당신은 큐세월듀에서 차단되었습니다.\n차단 사유: 스팸 차단\n이의제기를 하려면 주인#2222로 DM을 보내주세요.`)
                        .setColor(0xff6ee7),
                ],
            })

            await user.ban({
                reason: '스팸 차단',
            })
        }
    }
}

export function install() {
    return new Moderation()
}
