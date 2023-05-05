import { getMainGuild } from './guild'
import { config } from '../config'
import { CategoryChannel } from 'discord.js'

export const getTicketChannel = async () => (await getMainGuild()!.channels.fetch(config.ticketCategoryID, { cache: true })) as CategoryChannel

export const getTicketArchiveChannel = async () => (await getMainGuild()!.channels.fetch(config.ticketArchiveCategoryID, { cache: true })) as CategoryChannel

export const getTicketDeleteChannel = async () => (await getMainGuild()!.channels.fetch(config.ticketDeleteCategoryID, { cache: true })) as CategoryChannel
