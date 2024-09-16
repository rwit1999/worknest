import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const PATCH = async(req:Request)=>{
    try{
        const {userId}=auth()
     
        const jobId = await req.text() 

        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }

        const profile = await db.UserProfile.findUnique({
            where:{
                userId:userId as string
            }
        })

        if(!profile){
            return new NextResponse("User profile not found",{status:401})
        }

        const updatedProfile = await db.UserProfile.update({
            where:{
                userId
            },
            data:{
                appliedJobs:{
                    push:{jobId}
                }
            }
        })

        return NextResponse.json(updatedProfile)

    }catch(error){
        console.log(`Applied_JOB_patch:${error}`);
        return new NextResponse("Interval server error",{status:500})
        
    }
}