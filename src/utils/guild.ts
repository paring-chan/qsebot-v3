import { cts } from '../index'
import { config } from '../config'

export const getMainGuild = () => cts.client.guilds.cache.get(config.mainGuildId!)!
