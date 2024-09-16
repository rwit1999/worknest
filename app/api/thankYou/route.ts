import { compileThankYouEmailTemplate, sendMail } from "@/lib/mail"
import { NextResponse } from "next/server"

export const POST = async(req:Request)=>{
    const {email,fullName} = await req.json()

    const response = await sendMail({
        to:email,
        name:fullName,
        subject:"Thank you for applying",
        body:compileThankYouEmailTemplate(fullName) 
    })

    if(response?.messageId){
        return NextResponse.json("Mail delivered",{status:200})
    }else{
        return NextResponse.json("Mail not send",{status:401})
    }

}