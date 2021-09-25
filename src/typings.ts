import type { IUser } from './models'
import * as Discord from 'discord.js'

declare global {
    namespace Express {
        interface User {
            qse: IUser
            discord: Discord.User
        }
    }
}
