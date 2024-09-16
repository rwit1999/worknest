import { getJobs } from '@/actions/get-job'
import { Footer } from '@/components/footer'
import HomeSearchContainer from '@/components/homeSearchContainer'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import React from 'react'
import PageContent from './search/_components/pageContent'

const DashboardHomePage = async () => {
  const { userId } = auth()
  const jobs = await getJobs({})

  const categories = await db.Category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  const companies = await db.Company.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-teal-500 text-white py-12 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Find Your Dream Job Now</h2>
        <p className="text-lg font-medium">
          {jobs.length} + jobs for you to explore
        </p>
      </div>

      {/* Search Container */}
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <HomeSearchContainer />
      </div>

      {/* Banner Image */}
      <div className="relative w-full mt-10">
        <Image
          src={'/jobappBGImage.png'}
          alt="Home Banner"
          width={1000}
          height={400} // Adjusted height for a better fit
          className="mx-auto rounded-xl shadow-lg object-cover"
        />
      </div>

      {/* Companies Section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <h3 className="text-2xl font-bold mb-6">Top Companies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {companies.map(company => (
            <div key={company.id} className="p-6 bg-white rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-2">{company.name}</h4>
              {/* You can display a company logo or description here if available */}
              <Image src={company.logo} alt={company.name} width={100} height={100} />
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <h3 className="text-2xl font-bold mb-6">Job Categories</h3>
        <div className="flex flex-wrap gap-4">
          {categories.map(category => (
            <span key={category.id} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
              {category.name}
            </span>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <PageContent jobs={jobs} userId={userId} />
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

export default DashboardHomePage
