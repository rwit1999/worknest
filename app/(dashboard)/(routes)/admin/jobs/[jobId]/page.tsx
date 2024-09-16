import CategoryForm from '@/app/(dashboard)/(routes)/admin/jobs/[jobId]/_components/CategoryForm';
import DescriptionForm from '@/app/(dashboard)/(routes)/admin/jobs/[jobId]/_components/jobDescription';
import JobPublishAction from '@/app/(dashboard)/(routes)/admin/jobs/[jobId]/_components/JobPublishAction';
import ShiftTimingForm from '@/app/(dashboard)/(routes)/admin/jobs/[jobId]/_components/shiftTimingMode';
import ShortDescriptionForm from '@/app/(dashboard)/(routes)/admin/jobs/[jobId]/_components/shortDescription';
import TagsForm from '@/app/(dashboard)/(routes)/admin/jobs/[jobId]/_components/TagsForm';
import TitleForm from '@/app/(dashboard)/(routes)/admin/jobs/[jobId]/_components/TitleForm';
import Banner from '@/components/banner';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, ListCheck, Settings, Wrench } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import CompanyForm from './_components/companyForm';

const JobDetails = async ({ params }: { params: { jobId: string } }) => {
  const validObjectRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectRegex.test(params.jobId)) {
    return redirect('/admin/jobs');
  }

  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId
    }
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  });

  const companies = await db.company.findMany({
    where:{
      userId
    },
    orderBy: { name: "asc" }
  });

  if (!job) return redirect('/admin/jobs');

  const requiredFields = [job.title, job.description, job.categoryId];
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Back Button */}
      <Link href={'/admin/jobs'} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back
      </Link>

      <div className="bg-white flex p-6 rounded-lg shadow-lg mb-6">
        {/* Job Details Section */}
        <div className="flex-1 mr-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Job Details</h1>
          <p className="text-gray-600 mb-6">
            Complete all fields...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0">
          <JobPublishAction 
            jobId={params.jobId} 
            isPublished={job.isPublished} 
            disabled={!isComplete} 
          />
        </div>
      </div>

      {/* Warning Banner */}
      {!job.isPublished && (
        <Banner
          variant={"warning"}
          label="This job is not published. It will not be visible in the jobs list"
        />
      )}

      {/* Main Container */}
      <div className="bg-white p-6 mt-4 space-y-6">
        {/* Split Container */}
        <div className="flex justify-between space-x-6">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Customize your job</h2>
              </div>
              <Wrench className="h-6 w-6 text-gray-500" />
            </div>

            {/* Title Form */}
            <TitleForm jobId={job.id} initialData={job} />

            {/* Category Form */}
            <CategoryForm 
              jobId={job.id} 
              initialData={job} 
              options={categories.map((category) => ({
                label: category.name,
                value: category.id
              }))}
            />

            {/* Short Description Form */}
            <ShortDescriptionForm jobId={job.id} initialData={job} />

            {/* Job shift timing */}
            <ShiftTimingForm jobId={job.id} initialData={job} />
            
            {/* Job description */}
            <DescriptionForm jobId={job.id} initialData={job} />
          </div>

          {/* Right Column */}
          <div className="w-1/3 ">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <ListCheck className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">Job Requirements</h2>
              </div>
              <TagsForm jobId={job.id} initialData={job} />

              {/* company name */}
              <CompanyForm 
                jobId={job.id} 
                initialData={job} 
                options={companies.map((company) => ({
                  label: company.name,
                  value: company.id
                }))}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
