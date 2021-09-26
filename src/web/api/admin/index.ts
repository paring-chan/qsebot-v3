import Router from 'koa-router'
import { requireAdmin, requireAuth } from '../../middlewares'
import admins from './admins'
import util from './util'
import quiz from './quiz'

const router = new Router({ prefix: '/admin' })

router.use(requireAuth, requireAdmin)

router.use(admins.routes())

router.use(util.routes())

router.use(quiz.routes())

export default router
