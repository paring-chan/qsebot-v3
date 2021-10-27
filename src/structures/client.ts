import { CommandClient } from '@pikokr/command.ts'
import Discord, { ActivitiesOptions, Intents, IntentsString } from 'discord.js'
import _ from 'lodash'
import { config } from '../config'

const messages: ActivitiesOptions[] = [
    {
        name: `${config.prefix}밥`,
        type: 'PLAYING',
    },
    {
        name: `${config.prefix}가위바위보`,
        type: 'PLAYING',
    },
    {
        name: `${config.prefix}승률`,
        type: 'WATCHING',
    },
    {
        name: `${config.prefix}퀴즈`,
        type: 'PLAYING',
    },
    {
        name: '큐세 우튜브',
        type: 'STREAMING',
        url: 'https://www.youtube.com/c/%ED%81%90%EC%84%B8',
    },
    {
        name: '큐세 트위치 다시보기',
        type: 'STREAMING',
        url: 'https://twitch.tv/qse__',
    },
]

export class Client extends CommandClient {
    constructor() {
        super({
            client: new Discord.Client({
                intents: Object.keys(Intents.FLAGS) as IntentsString[],
                partials: ['GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'USER', 'REACTION'],
            }),
            owners: 'auto',
            command: {
                prefix: config.prefix,
            },
            slashCommands: {
                autoSync: true,
                guild: config.slash.guild,
            },
        })

        this.registry.loadModulesIn('modules')

        this.client.once('ready', () => {
            let i = 0
            setInterval(() => {
                if (!messages[i]) {
                    i = 0
                }

                const item = messages[i]

                console.log(item)

                this.client.user?.setPresence({
                    activities: [item],
                })

                i++
            }, 10000)
        })
    }
}
