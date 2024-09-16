import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async(req:Request,{params}:{params:{companyId:string}})=>{
    try{
        const {userId}=auth()
        const {companyId}=params
      
        const updatedValues = await req.json()

        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!companyId){
            return new NextResponse("Id is missing",{status:401})
        }

        const company = await db.company.update({
            where:{
                id:companyId,
                userId
            },
            data:{
                ...updatedValues
            }
        })

        return NextResponse.json(company)

    }catch(error){
        console.log(`Company_patch:${error}`);
        return new NextResponse("Interval server error",{status:500})
        
    }
}