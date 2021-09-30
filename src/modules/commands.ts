import { listener, Module } from '@pikokr/command.ts'
import { Message } from 'discord.js'
import { CustomCommand, CustomCommandVariable, ICustomCommand, ICustomCommandVariable } from '../models'
import { CommandCondition } from '../sharedTypings'
import { VM } from 'vm2'

class General extends Module {
    constructor() {
        super()
    }

    escapeRegexp(str: string) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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
        try {
            const command = await CustomCommand.findOne({
                $or: [
                    {
                        message: msg.content,
                        condition: CommandCondition.EQUALS,
                    },
                    {
                        message: {
                            $regex: this.escapeRegexp(msg.content),
                        },
                        condition: CommandCondition.CONTAINS,
                    },
                    {
                        message: {
                            $regex: `^${this.escapeRegexp(msg.content)}`,
                        },
                        condition: CommandCondition.STARTS_WITH,
                    },
                    {
                        message: {
                            $regex: `${this.escapeRegexp(msg.content)}$`,
                        },
                        condition: CommandCondition.ENDS_WITH,
                    },
                ],
            })
            if (!command) return
            await this.executeScript(msg, command)
        } catch (e) {
            console.error(e)
        }
    }
}

export function install() {
    return new General()
}
