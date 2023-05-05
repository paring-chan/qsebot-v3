import { listener, Module } from '@pikokr/command.ts'
import { Channel, Message, TextChannel } from 'discord.js'
import { getTicketArchiveChannel, getTicketChannel, getTicketDeleteChannel } from '../utils/channels'

class Ticket extends Module {
  @listener('messageCreate')
  async text(msg: Message) {
    if (msg.channel.type !== 'GUILD_TEXT') return
    if (msg.author.bot || msg.author.system) return
    const category = await getTicketChannel()

    if (msg.channel.parentId !== category.id) return

    const id = msg.channel.name.split('-').pop()

    if (!id) return

    const tc = await category.guild.members.fetch({ user: id, cache: true })

    if (!tc) return

    if (!msg.content && !msg.attachments.size) return

    try {
      await tc.user.send({
        content: msg.content ? msg.author.tag + ' - ' + msg.content : null,
        files: msg.attachments.map((x) => x),
      })
    } catch {
      await msg.react('❌')
      return
    }

    await msg.react('✅')
  }

  @listener('messageCreate')
  async dm(msg: Message) {
    if (msg.author.bot || msg.author.system) return
    if (msg.channel.type !== 'DM') return
    const category = await getTicketChannel()

    let tc: TextChannel = category.children.find((x) => x.name.split('-').pop() === msg.author.id && x.type === 'GUILD_TEXT') as TextChannel

    if (!tc) {
      const archive = await getTicketArchiveChannel()
      const c = archive.children.find((x) => x.name.split('-').pop() === msg.author.id && x.type === 'GUILD_TEXT') as TextChannel

      if (c) {
        await c.setParent(category)
        tc = c
      }
    }

    if (!tc) {
      const id = msg.author.id

      const channelName = `${msg.author.tag.slice(0, 100 - id.length - 1)}-${msg.author.id}`

      tc = await category.guild.channels.create(channelName, {
        type: 'GUILD_TEXT',
        reason: 'create ticket',
        parent: category,
        topic: `${msg.author}님의 티켓`,
      })

      await tc.send(`${msg.author.tag}님의 티켓입니다.`)
    }

    let webhook = (await tc.fetchWebhooks()).first()

    if (!webhook) {
      webhook = await tc.createWebhook('Ticket', {
        reason: 'Create ticket webhook',
      })
    }

    try {
      await webhook.send({
        username: msg.author.username,
        avatarURL: msg.author.displayAvatarURL({ size: 4096, dynamic: true, format: 'png' }),
        content: msg.content || null,
        files: msg.attachments.map((x) => x),
      })
    } catch {
      await msg.react('❌')
      return
    }

    await msg.react('✅')
  }

  @listener('channelUpdate')
  async channelUpdated(oldChannel: Channel, newChannel: Channel) {
    if (oldChannel.type !== 'GUILD_TEXT' || newChannel.type !== 'GUILD_TEXT') return
    const oldC = oldChannel as TextChannel
    const newC = newChannel as TextChannel

    if (!oldC.parentId) return

    const ticketId = (await getTicketChannel()).id
    const archiveId = (await getTicketArchiveChannel()).id
    const deleteId = (await getTicketDeleteChannel()).id

    const ids = [ticketId, archiveId, deleteId]
    if (!ids.includes(oldC.parentId)) return
    if (!ids.includes(oldC.parentId)) return

    if (oldC.parentId === ticketId && newC.parentId === archiveId) {
      await newC.send('티켓이 아카이브 처리되었습니다.')
      return
    } else if (oldC.parentId === archiveId && newC.parentId === ticketId) {
      await newC.send('티켓이 아카이브 해제되었습니다.')
      return
    } else if (newC.parentId === deleteId) {
      await newC.delete()
      return
    }
  }
}

export function install() {
  return new Ticket()
}
