import { Job } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import JobCardItem from './JobCardItem';

interface PageContentProps {
  jobs: Job[];
  userId: string | null;
}

const PageContent = ({ jobs, userId }: PageContentProps) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative w-64 h-64 mb-6">
          {/* Uncomment this to add an image when you have a proper src */}
          {/* <Image
            fill
            alt='Not found'
            src='/path/to/your/image.png'
            className="object-contain"
          /> */}
        </div>
        <h2 className="text-xl font-semibold text-gray-600">No Jobs Found</h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
      {jobs.map((job) => (
        <JobCardItem key={job.id} job={job} userId={userId} />
      ))}
    </div>
  );
};

export default PageContent;
