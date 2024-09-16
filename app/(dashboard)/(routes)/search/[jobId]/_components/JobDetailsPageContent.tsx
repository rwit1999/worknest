'use client';
import Banner from '@/components/banner';
import { Preview } from '@/components/preview';
import ApplyModal from '@/components/ui/applyModal';
import { Button } from '@/components/ui/button';
import { Company, Job, Resumes, UserProfile } from '@prisma/client';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface JobDetailsPageContentProps {
  job: Job & { company: Company | null };
  jobId: string;
  userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

const JobDetailsPageContent = ({ job, jobId, userProfile }: JobDetailsPageContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const onApplied = async()=>{
    setIsLoading(true)
    try{

      const response = await axios.patch(`/api/users/${userProfile?.userId}/appliedJobs`,jobId)

      //send mail to user
      await axios.post(`/api/thankYou`,{
        fullName:userProfile?.fullName,
        email:userProfile?.email
      })

      toast.success('Job Applied')

    }catch(error){
      console.log((error as Error)?.message);
      toast.error('Something went wrong')
    }finally{
      setOpen(false)
      setIsLoading(false)
      router.refresh()
    }
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <ApplyModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onApplied} loading={isLoading} userProfile={userProfile} />

      {
        userProfile && userProfile?.appliedJobs?.some(appliedJob=>appliedJob.jobId===jobId) && (
          <div className='mb-3'>
            <Banner
            variant={'success'}
            label="Thank you for applying! You application has been received, and we're reviewing it carefully. We'll be in touch soon with an update."
          />
          </div>
          
        )
      }

      {/* Job Title and Company */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-gray-800">
          <h2 className="text-3xl font-bold">{job?.title}</h2>
        </div>

        <div className="flex items-center space-x-4">
          {job?.company?.logo && (
            <Image
              alt={job?.company?.name}
              src={job?.company?.logo}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
          <p className="text-lg font-semibold text-gray-700">{job?.company?.name}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4">
        {userProfile ? (
          <>
            {!userProfile.appliedJobs.some(appliedJob => appliedJob.jobId === jobId) ? (
              <Button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => setOpen(true)}>
                Apply Now
              </Button>
            ) : (
              <Button className="px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed">
                Already Applied
              </Button>
            )}
          </>
        ) : (
          <Link href="/user">
            <Button className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
              Update Profile
            </Button>
          </Link>
        )}
      </div>

      {/* Job Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h2>
        <p className="text-gray-600 leading-relaxed mb-4">{job?.short_description}</p>
      </div>

      {/* Full Job Details */}
      {job?.description && (
        <div className="mt-6">
          <Preview value={job?.description} />
        </div>
      )}
    </div>
  );
};

export default JobDetailsPageContent;
