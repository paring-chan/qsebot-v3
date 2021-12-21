import * as yup from 'yup'

export const shopItemCreateSchema = yup.object().shape({
    name: yup.string().required(),
})
