import { YoutubeNotification } from '../models'
import { HUB_URL, pubSubHubbub } from '../websub'

export const YT_TOPIC_URL = (id: string) => 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=' + encodeURIComponent(id)

export async function registerAll() {
  const ids = (await YoutubeNotification.find()).map((x) => x.channelId)
  await Promise.all(
    ids.map(
      (x) =>
        new Promise<void>((resolve) =>
          pubSubHubbub.subscribe(YT_TOPIC_URL(x), HUB_URL, (err: any) => {
            console.log(`Subscribed ${x}`, err)
            resolve()
          })
        )
    )
  )
}

export async function unregisterAll() {
  const ids = (await YoutubeNotification.find()).map((x) => x.channelId)
  await Promise.all(
    ids.map(
      (x) =>
        new Promise<void>((resolve) =>
          pubSubHubbub.unsubscribe(YT_TOPIC_URL(x), HUB_URL, () => {
            console.log(`Unsubscribed ${x}`)
            resolve()
          })
        )
    )
  )
}
