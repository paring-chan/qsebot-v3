import Router from 'koa-router'
import { Quiz } from '../../../models'
import quizEdit from './quizEdit'
import { escapeRegexp } from '../../../utils/regexp'

const router = new Router({ prefix: '/quiz' })

const amount = 20

router.get('/', async (ctx) => {
  const page = Number(ctx.query.page)

  const count = await Quiz.count({
    question: { $regex: escapeRegexp(ctx.query.search as string) },
  })
  ctx.body = {
    data: await Quiz.find(
      {
        question: { $regex: escapeRegexp(ctx.query.search as string) },
      },
      [],
      { skip: amount * (page - 1), limit: amount }
    ),
    pages: Math.ceil(count / amount) || 1,
  }
})

router.post('/', async (ctx) => {
  const question = ctx.request.body.question
  if (!question) return (ctx.body = { error: '질문은 필수입니다.' })
  const quiz = new Quiz()
  quiz.question = question
  await quiz.save()
  ctx.body = { id: quiz._id }
})

router.use(quizEdit.routes())

export default router
