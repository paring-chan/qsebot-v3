import { command, coolDown, CoolDownType, guildOnly, Module } from '@pikokr/command.ts'
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

        const fee = noFee ? 0 : Number((money * 1.05 - money).toFixed(2))

        if (!noFee && u1.money < money * 1.05) {
            return msg.reply(`돈이업서요 필요한 돈: ${money} + 수수료(${fee}) => ${money * 1.05}`)
        } else if (noFee && u1.money < money) {
            return msg.reply(`돈이업서요 필요한 돈: ${money}(수수료 없음)`)
        }

        const m = await msg.reply({
            content: `${money}원을 ${user.tag}님에게 보냅니다.${noFee ? '' : `수수료: ${fee}`}`,
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

        u1.money -= money + fee
        u2.money += money
        q.money += fee
        await u1.save()
        await u2.save()

        return m.edit({
            components: [],
            content: `${user}님에게 ${money}원을 보냈습니다\n수수료로 큐세가 ${fee}원을 꺼억${noFee ? '하려 했는데 부스트방패에 막혀서 실패했습니다' : ''}\n남은 돈: ${u1.money}`,
        })
    }

    @command({ name: '돈' })
    async money(msg: Message) {
        const user = await getUser(msg.author)

        await msg.reply(`${msg.author.tag}님의 돈: ${user.money}`)
    }

    @command({ name: '돈조' })
    @coolDown(CoolDownType.USER, 60 * 60)
    async getMoney(msg: Message) {
        const user = await getUser(msg.author)

        const rand = Math.floor(Math.random() * 10)

        await user.save()

        if (rand === 10) {
            await msg.reply('헊 완전운좋기 무려최고금액!! 10원!!')
        } else if (rand === 0) {
            await msg.reply(`0원 당첨! 큐세를 핑하면 1원을 지급해드립니다`)
        } else {
            await msg.reply(`${rand}원을 얻었습니다.`)
        }
    }
}

export function install() {
    return new Money()
}
