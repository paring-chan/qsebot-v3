import mongoose from 'mongoose'

export interface IYoutubeNotification extends mongoose.Document {
    channelId: string
    channel: string
    script: string
}

const schema = new mongoose.Schema<IYoutubeNotification>({
    channelId: { type: String, required: true },
    channel: {
        type: String,
        required: true,
    },
    script: {
        type: String,
        required: true,
    },
})

export const YoutubeNotification = mongoose.model<IYoutubeNotification>('YoutubeNotification', schema, 'youtubeNotifications')
