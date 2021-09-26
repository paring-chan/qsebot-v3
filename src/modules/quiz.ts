import { command, Module } from '@pikokr/command.ts'
import { Client } from '../structures/client'
import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { IQuiz, Quiz } from '../models'

class QuizMod extends Module {
    constructor(private cts: Client) {
        super()
    }

    private static async getRandomQuiz(): Promise<IQuiz | null> {
        const count = await Quiz.count()
        const rand = Math.floor(Math.random() * count)
        return Quiz.findOne().skip(rand).exec()
    }

    private static renderButtons(quiz: IQuiz): MessageActionRow[] {
        const res: MessageActionRow[] = []
        for (const answer of quiz.answers.map((x, i) => ({
            value: x,
            index: i,
        }))) {
            res.push(
                new MessageActionRow().addComponents(
                    ...answer.value.map(
                        (x, i) =>
                            new MessageButton({
                                label: x.label || undefined,
                                emoji: x.emoji || undefined,
                                customId: `${answer.index}.${i}`,
                                style: x.style,
                            })
                    )
                )
            )
        }
        return res
    }

    @command({ name: '퀴즈', aliases: ['quiz'] })
    async quiz(msg: Message) {
        const quiz = await QuizMod.getRandomQuiz()
        if (!quiz) {
            await msg.reply('으에 퀴즈가 업서요')
            return
        }

        const m = await msg.reply({
            embeds: [new MessageEmbed().setTitle('퀴즈').setDescription(quiz.question).setColor('#ff6ee7')],
            components: QuizMod.renderButtons(quiz),
        })

        let b: ButtonInteraction

        try {
            b = await m.awaitMessageComponent({
                componentType: 'BUTTON',
                filter: async (i) => {
                    await i.deferUpdate()
                    return i.user.id === msg.author.id
                },
            })
        } catch (e) {
            return m.edit({ content: '시간초과', components: [], embeds: [] })
        }

        const [x, y] = b.customId.split('.').map((x) => parseInt(x))

        const { answer } = quiz.answers.find((_, i) => i === x)!.find((_, i) => i === y)!

        await m.edit({ components: [], content: answer, embeds: [] })
    }
}

export function install(cts: Client) {
    return new QuizMod(cts)
}
