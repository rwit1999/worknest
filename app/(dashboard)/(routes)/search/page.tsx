import { getJobs } from '@/actions/get-job'
import SearchContainer from '@/components/searchContainer'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import CategoriesList from './_components/categoriesList'
import PageContent from './_components/pageContent'

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

const SearchPage = async ({ searchParams }: SearchProps) => {

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    const { userId } = auth()
    
    const jobs = await getJobs({ ...searchParams })
   
    

    return (
        <div className="mt-[-2rem] min-h-screen flex flex-col items-start justify-start">
            <div className="w-full max-w-md px-4 py-8">
                {/* Search Container */}
                <div className="bg-white p-4 mb-4 rounded-md shadow-sm">
                    <SearchContainer />
                </div>
            </div>
            <div className="bg-white p-4 mb-4 mt-[-4rem] max-w-[60rem]">
                <CategoriesList categories={categories} />
            </div>

            {/* page content */}
            <PageContent jobs={jobs} userId={userId}/>
        </div>
    )
}

export default SearchPage
