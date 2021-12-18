import { listener, Module } from '@pikokr/command.ts'
import { MessageReaction, User } from 'discord.js'
import { IReactionRole, ReactionRole } from '../models'
import { ReactionRoleType } from '../sharedTypings'

class ReactionRoles extends Module {
    @listener('messageReactionAdd')
    async onReact(reaction: MessageReaction, user: User) {
        const mem = reaction.message.guild?.members.cache.get(user.id)
        if (!mem) return
        const item = (await ReactionRole.findOne({
            messageId: reaction.message.id,
            emoji: reaction.emoji.toString(),
            channel: reaction.message.channel.id,
        })) as IReactionRole
        if (!item) return
        if ([ReactionRoleType.GIVE, ReactionRoleType.MULTI].includes(item.type)) {
            await mem.roles.add(item.roleId)
        } else if (item.type === ReactionRoleType.REMOVE) {
            await mem.roles.remove(item.roleId)
        }
        if ([ReactionRoleType.GIVE, ReactionRoleType.REMOVE].includes(item.type)) {
            await reaction.users.remove(user)
        }
    }

    @listener('messageReactionRemove')
    async onReactionRemove(reaction: MessageReaction, user: User) {
        const mem = reaction.message.guild?.members.cache.get(user.id)
        if (!mem) return
        const item = (await ReactionRole.findOne({
            messageId: reaction.message.id,
            emoji: reaction.emoji.toString(),
            channel: reaction.message.channel.id,
        })) as IReactionRole
        if (!item) return
        if (item.type === ReactionRoleType.MULTI) {
            await mem.roles.remove(item.roleId)
        }
    }
}

export function install() {
    return new ReactionRoles()
}
