/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/datatable';
import Link from 'next/link';
import React from 'react';
import { columns, JobsColumns } from './_components/columns';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

const JobsPageOverview = async () => {
  const { userId } = auth();
  if (!userId) return redirect('/');

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
      company: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedJobs: JobsColumns[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company ? job.company.name : 'N/A',
    category: job.category ? job.category.name : 'N/A',
    isPublished: job.isPublished,
    createdAt: job.createdAt.toISOString(), // Convert Date to ISO string
  }));

  return (
    <div>
      <div className='mb-11'>
        <Link href={'/admin/create'}>
          <Button>Add Job</Button>
        </Link>
      </div>
      {/* data table */}
      <div className='mt-10'>
        <DataTable columns={columns} data={formattedJobs} />
      </div>
    </div>
  );
};

export default JobsPageOverview;
