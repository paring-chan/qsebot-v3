declare module 'pubsubhubbub' {
  import { Stream } from 'stream'
  import { IncomingMessage, ServerResponse } from 'http'

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Options {}

  function createServer(option: Options): PubSubHubBub

  class PubSubHubBub extends Stream {
    setSubscription(topic: string, hub: string, callbackUrl?: string, callback?: (unknown) => unknown)
    subscribe(mode: string, hub: string, callback?: (unknown) => unknown)
    unsubscribe(mode: string, hub: string, callback?: (unknown) => unknown)
    listen(port: number)
    listener(): (req: IncomingMessage, res: ServerResponse, next?: (unknown) => unknown) => void
  }
}
