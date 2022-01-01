import * as yup from 'yup'

export const shopItemCreateSchema = yup.object().shape({
    name: yup.string().required(),
})

export const shopItemUpdateSchema = yup.object().shape({
    name: yup.string().required(),
    desc: yup.string().required(),
    isPublished: yup.boolean(),
    cost: yup.number().required(),
    script: yup.string().default(''),
    questions: yup.array().of(yup.object()),
})
