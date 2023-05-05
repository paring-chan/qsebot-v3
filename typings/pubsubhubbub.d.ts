declare module 'pubsubhubbub' {
  import { Stream } from 'stream'
  import { IncomingMessage, ServerResponse } from 'http'

  interface Options {}

  function createServer(option: Options): PubSubHubBub

  class PubSubHubBub extends Stream {
    setSubscription(topic: string, hub: string, callbackUrl?: string, callback?: Function)
    subscribe(mode: string, hub: string, callback?: Function)
    unsubscribe(mode: string, hub: string, callback?: Function)
    listen(port: number)
    listener(): (req: IncomingMessage, res: ServerResponse, next?: Function) => void
  }
}
