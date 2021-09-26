import mongoose from 'mongoose'
import { User as DiscordUser } from 'discord.js'

export interface IUser extends mongoose.Document {
    id: string
    admin: boolean
}

const schema = new mongoose.Schema<IUser>({
    id: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
})

export const User = mongoose.model<IUser>('User', schema)

export const getUser = async (user: DiscordUser): Promise<IUser> => {
    let i = await User.findOne({ id: user.id })

    if (!i) {
        i = new User()

        i.id = user.id

        await i.save()
    }

    return i
}
