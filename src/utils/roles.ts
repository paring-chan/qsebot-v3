import { getMainGuild } from './guild'
import { config } from '../config'

export const getPinRole = async () => (await getMainGuild()!.roles.fetch(config.pinRole))!
