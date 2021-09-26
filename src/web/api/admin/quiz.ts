import Router from 'koa-router'
import { Quiz } from '../../../models'
import quizEdit from './quizEdit'

const router = new Router({ prefix: '/quiz' })

const amount = 20

router.get('/', async (ctx) => {
    let page = Number(ctx.query.page)
    const count = await Quiz.count()
    ctx.body = {
        data: await Quiz.find({}, [], { skip: amount * (page - 1), limit: amount }),
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
