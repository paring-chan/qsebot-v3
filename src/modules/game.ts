import { command, Module, optional } from '@pikokr/command.ts'
import { Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from 'discord.js'
import { RCPRate, DiceRate } from '../models'

enum RCPType {
  ROCK,
  SCISSORS,
  PAPER,
}

enum RCPWin {
  WIN = '너가 이겻서..',
  LOSE = '졌대요~메렁~',
  DRAW = '다시해!',
}

class Game extends Module {
  @command({ name: '가위바위보' })
  async rcp(msg: Message) {
    const rate =
      (await RCPRate.findOne({
        user: msg.author.id,
      })) ??
      new RCPRate({
        user: msg.author.id,
      })
    const emojis = {
      [RCPType.ROCK]: '✊',
      [RCPType.PAPER]: '🖐️',
      [RCPType.SCISSORS]: '✌️',
    }
    const m = await msg.reply({
      embeds: [new MessageEmbed().setTitle('가위바위보').setColor(0xff6ee7).setDescription('안내문진다 가위바위보<:qyam:822300534165864459>')],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton({
            customId: 'ROCK',
            emoji: emojis[RCPType.ROCK],
            style: 'PRIMARY',
          }),
          new MessageButton({
            customId: 'SCISSORS',
            emoji: emojis[RCPType.SCISSORS],
            style: 'PRIMARY',
          }),
          new MessageButton({
            customId: 'PAPER',
            emoji: emojis[RCPType.PAPER],
            style: 'PRIMARY',
          })
        ),
      ],
    })
    const res = await m
      .awaitMessageComponent({
        time: 30000,
        filter: async (args) => {
          await args.deferUpdate()
          return args.user.id === msg.author.id
        },
      })
      .catch(() => null)
    const rand = RCPType[
      (() => {
        const keys = Object.keys(RCPType).filter((k) => !(Math.abs(Number.parseInt(k)) + 1))
        return keys[Math.floor(Math.random() * keys.length)] as 'ROCK' | 'SCISSORS' | 'PAPER'
      })()
    ] as RCPType
    await m.edit({
      components: [],
    })
    if (!res)
      return m.edit({
        content: '시간초과',
        embeds: [],
        components: [],
      })
    await m.edit({
      embeds: [],
      content: emojis[rand],
    })
    const button = res!
    let type: RCPType
    switch (button.customId) {
      case 'SCISSORS':
        type = RCPType.SCISSORS
        break
      case 'ROCK':
        type = RCPType.ROCK
        break
      case 'PAPER':
        type = RCPType.PAPER
        break
      default:
        return
    }
    let win: RCPWin = RCPWin.DRAW
    if (rand !== type) {
      switch (rand) {
        case RCPType.PAPER:
          if (type === RCPType.SCISSORS) {
            rate.win++
            win = RCPWin.WIN
          } else {
            rate.lose++
            win = RCPWin.LOSE
          }
          break
        case RCPType.ROCK:
          if (type === RCPType.PAPER) {
            rate.win++
            win = RCPWin.WIN
          } else {
            rate.lose++
            win = RCPWin.LOSE
          }
          break
        case RCPType.SCISSORS:
          if (type === RCPType.ROCK) {
            rate.win++
            win = RCPWin.WIN
          } else {
            rate.lose++
            win = RCPWin.LOSE
          }
          break
      }
    }
    if (rand === type) rate.draw++
    if (!win) return
    await rate.save()
    await msg.reply({
      content: win,
    })
  }

  @command({ name: '주사위' })
  async dice(msg: Message, @optional command = '') {
    const rate =
      (await DiceRate.findOne({
        user: msg.author.id,
      })) ??
      new DiceRate({
        user: msg.author.id,
      })
    if (command === '') {
      const int = Math.floor(Math.random() * 6) + 1

      const m = await msg.reply({
        content: `1-6 중에 선택해 주세요`,
        components: [
          new MessageActionRow().addComponents(
            new MessageSelectMenu({
              customId: 'select',
              options: [1, 2, 3, 4, 5, 6].map((x) => ({
                label: x.toString(),
                value: x.toString(),
              })),
            })
          ),
        ],
      })

      try {
        const i = (await m.awaitMessageComponent({
          time: 30000,
          filter: async (args) => {
            await args.deferUpdate()
            return args.user.id === msg.author.id
          },
          componentType: 'SELECT_MENU',
        })) as SelectMenuInteraction
        if (i.customId !== 'select') return
        const value = parseInt(i.values[0])
        if (int === value) {
          await m.edit({
            content: `맞앗서요\n주사위: ${int}`,
          })
          rate.correct++
        } else {
          await m.edit({
            content: `틀렷서요(${value})\n주사위: ${int}`,
          })
          rate.incorrect++
        }
        await rate.save()
      } finally {
        await m.edit({
          components: [],
        })
      }
    } else if (command === '승률') {
      if (!rate.correct && !rate.incorrect) return msg.reply('전적이 업서요!!!')

      await msg.reply({
        content: `${msg.author} 님의 전적은 ${rate.correct} / ${rate.incorrect}, 승률 ${
          msg.author.id === '333557403352301588' ? Infinity : ((rate.correct / (rate.correct + rate.incorrect)) * 100).toFixed(4)
        }% 입니다.`,
      })
    } else if (command === '승률초기화') {
      rate.correct = 0
      rate.incorrect = 0
      await rate.save()
      await msg.reply('✅')
    }
  }

  @command({ name: '승률' })
  async winRate(msg: Message) {
    const rate = await RCPRate.findOne({ user: msg.author.id })
    if (!rate) return msg.reply('승률 데이터가 업서요')
    await msg.reply(
      `${msg.author} 님의 전적은 KDA ${rate.win} / ${rate.lose} / ${rate.draw}, 승률 ${
        msg.author.id === '333557403352301588' ? Infinity : ((rate.win / (rate.lose + rate.draw + rate.win)) * 100).toFixed(4)
      }% 입니다.`
    )
  }
}

export function install() {
  return new Game()
}
