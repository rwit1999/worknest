import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async(req:Request)=>{
    try{
        const {userId}=auth()
        // console.log('anfkadnfkan');
        
        const {name}=await req.json()  

        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!name){
            return new NextResponse("Name is missing",{status:401})
        }

        const company = await db.company.create({
            data:{
                userId,
                name
            }
        })

        return NextResponse.json(company)

    }catch(error){
        console.log(`Company_post:${error}`);
        return new NextResponse("Interval server error",{status:500})
        
    }
}