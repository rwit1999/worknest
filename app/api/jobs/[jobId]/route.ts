import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async(req:Request,{params}:{params:{jobId:string}})=>{
    try{
        const {userId}=auth()
        const {jobId}=params
        // console.log("qjeiriqero");
        
        const updatedValues = await req.json()

        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!jobId){
            return new NextResponse("Id is missing",{status:401})
        }

        const job = await db.job.update({
            where:{
                id:jobId,
                userId
            },
            data:{
                ...updatedValues
            }
        })

        return NextResponse.json(job)

    }catch(error){
        console.log(`Job_patch:${error}`);
        return new NextResponse("Interval server error",{status:500})
        
    }
}


export const DELETE = async(req:Request,{params}:{params:{jobId:string}})=>{
    try{
        const {userId}=auth()
        const {jobId}=params
    
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!jobId){
            return new NextResponse("Id is missing",{status:401})
        }

        const job = await db.job.update({
            where:{
                id:jobId,
                userId
            }
        })

        if(!job){
            return new NextResponse("Job not found",{status:404})
        }

        const deleteJob = await db.job.delete({
            where:{
                id:jobId,
                userId
            }
        })

        return NextResponse.json(deleteJob)

    }catch(error){
        console.log(`Job_patch:${error}`);
        return new NextResponse("Interval server error",{status:500})
        
    }
}