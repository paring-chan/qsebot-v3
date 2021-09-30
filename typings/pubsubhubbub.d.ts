declare module 'pubsubhubbub' {
    import { Stream } from 'stream'
    import { IncomingMessage, ServerResponse } from 'http'

    interface Options {}

    function createServer(option: Options): PubSubHubBub

    class PubSubHubBub extends Stream {
        setSubscription(mode: string, topic: string, callbackUrl?: string, callback?: Function)
        subscribe(mode: string, topic: string, callbackUrl?: string, callback?: Function)
        unsubscribe(mode: string, topic: string, callbackUrl?: string, callback?: Function)
        listen(port: number)
        listener(): (req: IncomingMessage, res: ServerResponse, next?: Function) => void
    }
}
