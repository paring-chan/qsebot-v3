import Router from 'koa-router'
import { Quiz } from '../../../models'

const router = new Router({ prefix: '/quiz' })

router.get('/', async (ctx) => {
    ctx.body = await Quiz.find()
})

router.post('/', async (ctx) => {
    const question = ctx.request.body.question
    if (!question) return (ctx.body = { error: '질문은 필수입니다.' })
    const quiz = new Quiz()
    quiz.question = question
    await quiz.save()
    ctx.body = { id: quiz._id }
})

export default router
