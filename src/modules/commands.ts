import { listener, Module } from '@pikokr/command.ts'
import { Message } from 'discord.js'
import { Blacklist, CustomCommand, CustomCommandVariable, ICustomCommand, ICustomCommandVariable } from '../models'
import { CommandCondition } from '../sharedTypings'
import { VM } from 'vm2'

class General extends Module {
    constructor() {
        super()
    }

    async setVariable(command: ICustomCommand, key: string, value: any) {
        let variable = await CustomCommandVariable.findOne({
            key,
            command: command._id,
        })
        if (!variable) {
            variable = new CustomCommandVariable()
            variable.command = command._id
            variable.key = key
        }
        variable.value = value
        await variable.save()
    }

    async getVariable(command: ICustomCommand, key: string) {
        let variable: ICustomCommandVariable | null = await CustomCommandVariable.findOne({
            key,
            command: command._id,
        })
        if (!variable) return null
        return variable.value
    }

    async executeScript(msg: Message, command: ICustomCommand) {
        const script = command.script

        const vm = new VM({
            sandbox: {
                msg,
                getVariable: (key: string) => this.getVariable(command, key),
                setVariable: (key: string, value: any) => this.setVariable(command, key, value),
                count: async () => {
                    return ((await this.getVariable(command, 'count')) || { count: 0 }).count
                },
                countUp: async () => {
                    const count = ((await this.getVariable(command, 'count')) || { count: 0 }).count
                    await this.setVariable(command, 'count', { count: count + 1 })
                },
                importModule: (path: string) => require(path),
            },
        })

        try {
            await vm.run(`(async () => {
                ${script}
            })()`)
        } catch (e) {
            console.error(e)
        }
    }

    @listener('messageCreate')
    async onMessage(msg: Message) {
        if (msg.author.bot || msg.author.system) return
        if (!msg.content) return
        try {
            const commands: ICustomCommand[] = await CustomCommand.find()
            const command = commands.find((x) => {
                switch (x.condition) {
                    case CommandCondition.EQUALS:
                        return x.message === msg.content
                    case CommandCondition.CONTAINS:
                        return msg.content.includes(x.message)
                    case CommandCondition.STARTS_WITH:
                        return msg.content.startsWith(x.message)
                    case CommandCondition.ENDS_WITH:
                        return msg.content.endsWith(x.message)
                    default:
                        return false
                }
            })
            if (!command) return
            await this.executeScript(msg, command)
        } catch (e) {
            console.error(e)
        }
    }

    @listener('messageCreate')
    async blackOnMessage(msg: Message) {
        if (msg.author.bot || msg.author.system) return
        if (!msg.content) return
        try {
            const blacklists = await Blacklist.find()
            const blacklist = blacklists.find((x) => x.trigger.some((y) => msg.content.includes(y)))
            if (!blacklist) return

            const vm = new VM({
                sandbox: {
                    msg,
                    importModule: (path: string) => require(path),
                },
            })

            try {
                await vm.run(`(async () => {
                ${blacklist.script}
            })()`)
            } catch (e) {
                console.error(e)
            }
        } catch (e) {
            console.error(e)
        }
    }
}

export function install() {
    return new General()
}
