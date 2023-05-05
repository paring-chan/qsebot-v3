import Router from 'koa-router'
import { Blacklist } from '../../../../models'
import { escapeRegexp } from '../../../../utils/regexp'
import edit from './edit'
import * as yup from 'yup'

const router = new Router({ prefix: '/blacklist' })

const amount = 20

router.use(edit.routes())

router.get('/', async (ctx) => {
  const page = Number(ctx.query.page)

  const count = await Blacklist.count({ message: { $regex: escapeRegexp(ctx.query.search as string) } })
  ctx.body = {
    data: await Blacklist.find({ message: { $regex: escapeRegexp(ctx.query.search as string) } }, [], { skip: amount * (page - 1), limit: amount }),
    pages: Math.ceil(count / amount) || 1,
  }
})

export const blacklistSchema = yup
  .object()
  .shape({
    trigger: yup.array().of(yup.string().required()).min(1),
    script: yup.string().required(),
  })
  .required()

router.post('/', async (ctx) => {
  const body = await blacklistSchema.validate(ctx.request.body)

  console.log(body)

  const item = new Blacklist()

  item.trigger = body.trigger

  item.script = body.script

  await item.save()

  ctx.body = { ok: 1, id: item._id }
})

export default router
