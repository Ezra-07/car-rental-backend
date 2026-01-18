import { z } from 'zod'

const signupSchema=z.object({
    username:z
        .string()
        .min(1)
        .max(50),
    password:z
        .string()
        .min(1)
})
export default signupSchema