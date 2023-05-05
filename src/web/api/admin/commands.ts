import Router from 'koa-router'
import { CustomCommand } from '../../../models'
import { CommandCondition } from '../../../sharedTypings'
import editCommand from './editCommand'
import { escapeRegexp } from '../../../utils/regexp'

const router = new Router({ prefix: '/commands' })

const amount = 20

router.get('/', async (ctx) => {
  const page = Number(ctx.query.page)

  const count = await CustomCommand.count({ message: { $regex: escapeRegexp(ctx.query.search as string) } })
  ctx.body = {
    data: await CustomCommand.find({ message: { $regex: escapeRegexp(ctx.query.search as string) } }, [], { skip: amount * (page - 1), limit: amount }),
    pages: Math.ceil(count / amount) || 1,
  }
})

router.post('/', async (ctx) => {
  const body = ctx.request.body
  if (!body.message) return (ctx.body = { error: '메시지는 필수입니다.' })
  if (!body.script) return (ctx.body = { error: '스크립트는 필수입니다.' })
  if (!CommandCondition[body.condition]) return (ctx.body = { error: '알 수 없는 실행 조건입니다.' })

  const command = new CustomCommand()

  command.message = body.message

  command.condition = body.condition

  command.script = body.script

  await command.save()

  ctx.body = { ok: 1, id: command._id }
})

router.use(editCommand.routes())

export default router
