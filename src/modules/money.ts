import { command, guildOnly, Module } from '@pikokr/command.ts'
import { Message, MessageActionRow, MessageButton, User } from 'discord.js'
import { getUser } from '../models'
import { getMainGuild } from '../utils/guild'

class Money extends Module {
    @command({ name: '송금' })
    @guildOnly
    async sendMoney(msg: Message, user: User, money: number) {
        const u1 = await getUser(msg.author)
        const qse = await getMainGuild().fetchOwner({ cache: true })

        const noFee = msg.member!.roles.cache.has(msg.guild!.roles.premiumSubscriberRole!.id)

        if (!noFee && u1.money < money * 1.05) {
            return msg.reply(`돈이업서요 필요한 돈: ${money} + 수수료(${money * 1.05 - money}) => ${money * 1.05}`)
        } else if (noFee && u1.money < money) {
            return msg.reply(`돈이업서요 필요한 돈: ${money}(수수료 없음)`)
        }

        const m = await msg.reply({
            content: `${money}원을 ${user.tag}님에게 보냅니다.${noFee ? '' : `수수료: ${money * 1.05 - money}`}`,
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton().setCustomId('ok').setStyle('SUCCESS').setLabel('OK'),
                    new MessageButton().setCustomId('cancel').setStyle('DANGER').setLabel('취소')
                ),
            ],
        })

        const reset = async () => {
            await m.edit({
                components: [],
                content: `${user}님에게 ${money}원을 보내려는 줄 알았는데 자기 지갑에 넣으시는 거였군요`,
            })
        }

        try {
            const i = await m.awaitMessageComponent({
                componentType: 'BUTTON',
                filter: async (i) => {
                    await i.deferUpdate()
                    return i.user.id === msg.author.id
                },
            })

            if (i.customId !== 'ok') {
                return reset()
            }
        } catch (e) {
            return reset()
        }

        const u2 = await getUser(user)

        const q = await getUser(qse.user)

        u1.money -= money * (noFee ? 1 : 1.05)
        u2.money += money
        q.money += money * (noFee ? 1 : 1.05) - money
        await u1.save()
        await u2.save()

        return m.edit({
            components: [],
            content: `${user}님에게 ${money}원을 보냈습니다\n수수료로 큐세가 ${money * 1.05 - money}원을 꺼억${
                noFee ? '하려 했는데 부스트방패에 막혀서 실패했습니다' : ''
            }\n남은 돈: ${u1.money}`,
        })
    }

    @command({ name: '돈' })
    async money(msg: Message) {
        const user = await getUser(msg.author)

        await msg.reply(`${msg.author.tag}님의 돈: ${user.money}`)
    }
}

export function install() {
    return new Money()
}
