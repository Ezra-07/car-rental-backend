import express from "express"
import signupSchema from "../schema/auth.schema.js"
import { User } from "../models/User.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router=express.Router()

router.post('/signup', async (req,res)=>{
    const result=signupSchema.safeParse(req.body)
    if(!result.success){
        return res.status(400).json({
            success: false,
            error:"invalid inputs"
        })
    }
    const { username, password } = result.data
    const existingUser = await User.findByUsername(username)
    if (existingUser) {
        return res.status(409).json({
            success: false,
            error:"username already exists"
        })   
    }
    try{
        const hashedPassword = await bcrypt.hash(password,10)
        const user=await User.create(username,hashedPassword)
        return res.status(201).json({
                success: true,
                data: {
                    message: "User created successfully",
                    userId: user.id
                }
        })
    }catch (error){
        return res.status(500).json({
                success: false,
                error:"internal server error"
        })
    }
})
router.post("/login",async (req,res)=>{
    const result=signupSchema.safeParse(req.body)
    if(!result.success){
        return res.status(400).json({
            success: false,
            error:"invalid inputs"
        })
    } 
    const {username,password}=result.data
    const user=await User.findByUsername(username)
    if(user===null){
        return res.status(401).json({
            success:false,
            error:"user does not exist"
        })
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({
            success:false,
            error:"incorrect password"
        }) 
    }
    const token=jwt.sign(
        {
            username:user.username,
            userId:user.id
        },process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN
        }
    )
    return res.status(200).json({
            success: true,
            data: {
                message:"Login successful",
                token:token
            }
    })
})
export default router