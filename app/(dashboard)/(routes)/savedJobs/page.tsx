import { getJobs } from '@/actions/get-job'
import SearchContainer from '@/components/searchContainer'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import PageContent from '../search/_components/pageContent'

interface SearchProps {
    searchParams: {
        title: string,
        categoryId: string,
        createdAtFilter: string,
        shiftTiming: string,
        workmode: string,
        yearsOfExperience: string
    }
}


const SavedJobs = async({searchParams}:SearchProps) => {

    const {userId}=auth()
    if(!userId){
        redirect('/')
    }

    const jobs = await getJobs({...searchParams,savedJobs:true})

  return (
    <div>
        <div>
            <SearchContainer/>
        </div>

        <div>
            <PageContent jobs={jobs} userId={userId}/>
        </div>
    </div>
  )
}

export default SavedJobs