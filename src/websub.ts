import * as PubSubHubbub from 'pubsubhubbub'
import { config } from './config'

export const HUB_URL = 'https://pubsubhubbub.appspot.com/'

export const pubSubHubbub = PubSubHubbub.createServer({ callbackUrl: config.pubsubCallback, secret: Date.now().toString() })

pubSubHubbub.on('feed', ({ feed }) => {
  console.log(feed.toString())
})
