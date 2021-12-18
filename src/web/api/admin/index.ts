import Router from 'koa-router'
import { requireAdmin, requireAuth } from '../../middlewares'
import admins from './admins'
import util from './util'
import quiz from './quiz'
import commands from './commands'
import notifications from './notifications'
import blacklist from './blacklist'
import reactionRole from './reactionRole'

const router = new Router({ prefix: '/admin' })

router.use(requireAuth, requireAdmin)

router.use(admins.routes())

router.use(util.routes())

router.use(quiz.routes())

router.use(commands.routes())

router.use(notifications.routes())

router.use(blacklist.routes())

router.use(reactionRole.routes())

export default router
