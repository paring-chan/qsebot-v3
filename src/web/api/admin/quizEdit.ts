import Router from 'koa-router'
import { AnswerButton, IQuiz, Quiz } from '../../../models'
import * as yup from 'yup'

const router = new Router({ prefix: '/:id' })

declare module 'koa' {
  interface BaseContext {
    quiz: IQuiz
  }
}

router.use(async (ctx, next) => {
  const id = ctx.params.id

  const quiz = await Quiz.findById(id)

  if (!quiz) return ctx.throw(404)

  ctx.quiz = quiz

  return next()
})

const editSchema = yup.object().shape({
  answers: yup
    .array()
    .of(
      yup
        .array()
        .of(
          yup.object().shape({
            emoji: yup.string(),
            label: yup.string(),
            answer: yup.string().required(),
          })
        )
        .min(1)
    )
    .required()
    .min(1),
  question: yup.string().required(),
})

router.put('/', async (ctx) => {
  type bodyType = { question: string; answers: AnswerButton[][] }

  let data: bodyType
  try {
    data = (await editSchema.validate(ctx.request.body)) as unknown as bodyType
  } catch (e: any) {
    return (ctx.body = { error: e.message })
  }
  if (data.answers.find((x) => x.find((y) => !y.label && !y.emoji))) {
    return (ctx.body = { error: 'label or emoji is required.' })
  }
  ctx.quiz.answers = data.answers
  ctx.quiz.ready = true
  await ctx.quiz.save()
  ctx.body = { ok: 1 }
})

router.delete('/', async (ctx) => {
  await ctx.quiz.delete()

  ctx.body = { ok: 1 }
})

router.get('/', (ctx) => {
  ctx.body = ctx.quiz
})

export default router
