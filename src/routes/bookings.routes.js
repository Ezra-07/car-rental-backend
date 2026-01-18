import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import {bookingSchema,statusSchema} from "../schema/booking.schema.js"
import {Booking}  from "../models/Bookings.model.js"
import { success } from "zod"

const router =express.Router()

router.use(authMiddleware)

router.post('/',async (req,res)=>{
    const result=bookingSchema.safeParse(req.body)
    if(!result.success){
        return res.status(400).json({
            success:false,
            error:"invalid inputs"
        })
    }
    try{
        const userId=req.user.userId
        const {carName,days,rentPerDay}=result.data
        const booking= await Booking.create({
            userId,
            carName,
            days,
            rentPerDay
        })
        return res.status(201).json(
            {
                success:true,
                data: {
                    message:"Booking created successfully",
                    bookingId:booking.id,
                    totalCost:parseInt(days)*parseInt(rentPerDay)
                }
            }
        )
    }catch (error){
        return res.status(500).json({
                success: false,
                error:"internal server error"
        })
    }
})

router.get('/',async (req,res)=>{
    const { bookingId, summary } = req.query;
    if(bookingId && summary){
        return res.status(400).json({
            success: false,
            error: "invalid inputs"
        })
    }
    if (summary === "true") {
        try{
            const result=await Booking.getSummary(req.user.userId)
            return res.status(200).json({
                success: true,
                data:{
                    userId:req.user.userId,
                    username:req.user.username,
                    totalBookings:parseInt(result.total_bookings),
                    totalAmountSpent:parseInt(result.total_amount)
                }
            })
        }catch (err){
            return res.status(404).json({
                success: false,
                error:"no booking for current user"
            })
        }
    }else if(bookingId){
        try{
            const result=await Booking.findById(bookingId)
            return res.status(200).json({
                success: true,
                data:{
                    "id":bookingId,
                    "car_name":result.car_name,
                    "days":result.days,
                    "rent_per_day":result.rent_per_day,
                    "status":"booked",
                    "totalCost":result.days*result.rent_per_day
                }
            })
        }catch(err){
            return res.status(404).json({
                success: false,
                error:"bookingId not found"
            })
        }
    }else{
        return res.status(400).json({
            success: false,
            error: "invalid inputs"
        }) 
    }
})

router.put('/:bookingId',async (req,res)=>{
    const id=req.params.bookingId
    try{
        const user=await Booking.findById(id)
        if(user===null) {
            return res.status(404).json({
                success:false,
                error:"booking not found"
            })
        }
        if(user.user_id===req.user.userId){
            const {status,carName,days,rentPerDay}=req.body
            if(status && !carName && !days && !rentPerDay){
                const result=statusSchema.safeParse(req.body)
                if(!result.success){
                    return res.status(400).json({
                        success:false,
                        error:"invalid input"
                    })
                }
                const UPDATE=await Booking.updateById(id,req.body)
                return res.status(200).json({
                    success: true,
                    data: {
                        message:"Booking updated successfully",
                        booking:{
                            id:UPDATE.id,
                            car_name:UPDATE.car_name,
                            days:UPDATE.days,
                            rent_per_day:UPDATE.rent_per_day,
                            status:UPDATE.status,
                            totalCost:UPDATE.days*UPDATE.rent_per_day
                        }
                    }
                })
            }else if(!status && carName && days && rentPerDay){
                const result=bookingSchema.safeParse(req.body)
                if(!result.success){
                    return res.status(400).json({
                        success:false,
                        error:"invalid input"
                    })
                }
                const UPDATE=await Booking.updateById(id,req.body)
                return res.status(200).json({
                    success: true,
                    data: {
                        message:"Booking updated successfully",
                        booking:{
                            id:UPDATE.id,
                            car_name:UPDATE.car_name,
                            days:UPDATE.days,
                            rent_per_day:UPDATE.rent_per_day,
                            status:UPDATE.status,
                            totalCost:UPDATE.days*UPDATE.rent_per_day
                        }
                    }
                })
            }else{
                return res.status(400).json({
                    success:false,
                    error:"invalid input"
                })
            }
        }else{
            return res.status(403).json({
                success:false,
                error:"booking does not belong to user"
            })
        }
    }catch (err) {
        return res.status(500).json({
            success:false,
            error:"internal server error"
        })
    }
})
router.delete("/:bookingId",async (req,res)=>{
    const id=req.params.bookingId
    try{
        const user=await Booking.findById(id)
        if(user===null) {
            return res.status(404).json({
                success:false,
                error:"booking not found"
            })
        }
        if(user.user_id===req.user.userId){
            const result=await Booking.deleteById(id)
            return res.status(200).json({
                success: true,
                data: {
                    message:"Booking deleted successfully"
                }
            })
        }else{
            return res.status(403).json({
                success:false,
                error:"booking does not belong to user"
            })
        }
    }catch (err) {
        return res.status(500).json({
            success:false,
            error:"internal server error"
        })
    } 
})
export default router