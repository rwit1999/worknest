/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import React from 'react'
import { ApplicantColumns, columns } from './_components/columns'
import { format } from 'date-fns'
import { DataTable } from '@/components/ui/datatable'

const JobApplicantsPage = async ({params}:{params:{jobId:string}}) => {

    const {userId }=auth()

    const job = await db.Job.findUnique({
        where:{
            id:params.jobId,
            userId:userId as string
        }
    })

    if(!job){
        redirect('/admin/jobs')
    }

    const profiles = await db.UserProfile.findMany({
        include:{
            resumes:{
                orderBy:{
                    createdAt:"desc"
                }
            }
        }
    })

    // const jobs = await db.Job.findMany({
    //     where:{
    //         userId:userId as string
    //     },
    //     include:{
    //         company:true,
    //         category:true
    //     },
    //     orderBy:{
    //         createdAt:"desc"
    //     }
    // })

    const filteredProfiles = profiles && 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profiles.filter((profile: { appliedJobs: any[] })=>profile.appliedJobs.some((appliedJob)=>appliedJob.jobId===params.jobId))


    const formattedProfiles:ApplicantColumns[] = filteredProfiles.map(profile=>({
        id:profile.userId,
        fullName:profile.fullName ? profile.fullName : "",
        email:profile.email ? profile.email : "",
        contact: profile.contact? profile.contact : "",
        appliedAt: profile.appliedJobs.find(job=>job.jobId===params.jobId)?.appliedAt ? 
            format(new Date(profile.appliedJobs.find(job=>job.jobId===params.jobId)?.appliedAt??""),"MMMM do, yyyy"):"",
        resume:profile.resumes.find((res)=>res.id===profile.activeResumeId)?.url ?? "",
        resumeName:profile.resumes.find(res=>res.id===profile.activeResumeId)?.name ?? ""

    }))
    

  return (
    <div>
        <div>
            <DataTable
                columns={columns}
                data={formattedProfiles}
            />
        </div>
    </div> 
  )
}

export default JobApplicantsPage