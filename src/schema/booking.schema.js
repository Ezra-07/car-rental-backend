import {z} from 'zod'

const bookingSchema=z.object({
    carName:z
        .string()
        .min(1)
        .max(100),
    days:z
        .number()
        .min(0)
        .max(365),
    rentPerDay:z
        .number()
        .min(1)
        .max(2000)    
}).strict()
const statusSchema=z.object({
    status:z.enum(["cancelled","completed","booked"])
}).strict()

export  {bookingSchema,statusSchema}