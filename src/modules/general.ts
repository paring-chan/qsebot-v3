import { CoolDownError, listener, Module } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { GuildMember, Message } from 'discord.js'
import { config } from '../config'
class General extends Module {
  constructor(private cts: Client) {
    super()
  }

  @listener('ready')
  ready() {
    this.logger.info(`Logged in as ${this.cts.client.user?.tag}`)
  }

  @listener('commandError')
  async commandError(err: Error, msg: Message) {
    if (err instanceof CoolDownError) {
      const current = err.endsAt.getTime() - Date.now()
      const seconds = Math.floor((current / 1000) % 60)
      const minutes = Math.floor((current / (1000 * 60)) % 60)
      const hours = Math.floor(current / 3_600_000)
      await msg.reply('쿨타임 남아잇기\n남은시간: ' + (hours ? hours + '시간 ' : '') + (minutes ? minutes + '분 ' : '') + (seconds + '초'))
      return
    }
    this.logger.error(err)
  }

  @listener('slashCommandError')
  slashCommandError(err: Error) {
    this.logger.error(err)
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
