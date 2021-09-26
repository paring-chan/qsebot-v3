import Router from 'koa-router'
import { IQuiz, Quiz } from '../../../models'

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

router.get('/', (ctx) => {
    ctx.body = ctx.quiz
})

export default router
