import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import JobDetailsPageContent from './_components/JobDetailsPageContent'
import { Separator } from '@/components/ui/separator'
import { getJobs } from '@/actions/get-job'
import PageContent from '../_components/pageContent'

const JobDetails = async ({params}:{params:{jobId:string}}) => {

    const {userId} = auth()

    const job = await db.Job.findUnique({
        where:{
            id:params.jobId
        },
        include:{
            company:true
        }
    })

    if(!job)redirect('/search')

    const profile = await db.UserProfile.findUnique({
        where:{
            userId:userId as string
        },
        include:{
            resumes:{
                orderBy:{
                    createdAt:"desc"
                }
            }
        }
    })

    const jobs = await getJobs({})

    // all jobs apart from the current job and whose category is same( .....basically related jobs kind of)
    const filteredJobs = jobs.filter(j=>j.id!==job?.id && j.categoryId===job?.categoryId)

  return (
    <div>
        <JobDetailsPageContent job={job} jobId={job.id} userProfile={profile}/>
        
        {filteredJobs && filteredJobs.length>0 && (
            <>
                <Separator/>
                <div>
                    <h2>Related Jobs</h2>
                </div>

                <PageContent jobs={filteredJobs} userId={userId}/>
            </>
        )}

    </div>
  )
}

export default JobDetails