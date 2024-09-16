import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req:Request,{params}:{params:{jobId:String}})=>{
    try{
        const {userId}=auth()
        const {jobId}=params

        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }

        if(!jobId){
            return new NextResponse("Id is missing",{status:401})
        }

        const job = await db.job.findUnique({
            where:{
                id:jobId,
            }
        })

        if(!job){
            return new NextResponse("Job not found",{status:404})
        }

        const userIndex = job.savedUsers.indexOf(userId)

        let updatedJob

        if(userIndex!==-1){
            //update the job
            updatedJob = await db.job.update({
                where:{
                    id:jobId,
                },
                data:{
                    savedUsers:{
                        set:job.savedUsers.filter((savedUserId: string)=>savedUserId!==userId)
                    }
                }
            })
        }


        return NextResponse.json({updatedJob})

    }catch(error){
        console.log(error);
        return new NextResponse("Internal Server Error",{status:500})
    }
}