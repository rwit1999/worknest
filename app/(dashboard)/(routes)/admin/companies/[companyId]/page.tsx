import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, Network, Settings, Wrench } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation';
import React from 'react'
import CompanyNameForm from './nameForm';
import CompanyLogoForm from './companyLogo';
import CompanyDescriptionForm from './companyDescription';
import ContactsForm from './contacts';
import CompanyOverviewForm from './companyOverview';

const CompanyDetails =async ({ params }: { params: { companyId: string } }) => {

  const validObjectRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectRegex.test(params.companyId)) {
    return redirect('/admin/companies');
  }

  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }

  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
      userId
    } 
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" }
  });

  if (!company) return redirect('/admin/companys');

  const requiredFields = [
    company.name, 
    company.description, 
    company.logo, 
    company.coverImage,
    company.mail,
    company.website,
    company.linkedIn,
    company.address_line_1,
    company.city,
    company.state,
    company.whyJoinUs,
    company.state,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Back Button */}
      <Link href={'/admin/companys'} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back
      </Link>

      <div className="bg-white flex p-6 rounded-lg shadow-lg mb-6">
        {/* company Details Section */}
        <div className="flex-1 mr-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Company Details</h1>
          <p className="text-gray-600 mb-6">
            Complete all fields {completionText}
          </p>
        </div>
      </div>

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
                <h2 className="text-xl font-semibold text-gray-800">Customize company details</h2>
              </div>
              <Wrench className="h-6 w-6 text-gray-500" />
            </div>

            {/* Name Form */}
            <CompanyNameForm companyId={company.id} initialData={company} />

            {/* Descripition Form */}
            <CompanyDescriptionForm companyId={company.id} initialData={company} />

            {/* company logo */}
            <CompanyLogoForm companyId={company.id} initialData={company}/>
          
            
          </div>

          {/* Right Column */}
          <div className="w-2/4 ">
            <div>
              <div className='mt-14'>
                
                {/* socials form */}
                <ContactsForm companyId={company.id} initialData={company} />
              </div>
            </div>
          </div>
        </div>

          <div className='col-span-2'>
            <CompanyOverviewForm companyId={company.id} initialData={company}/>
          </div>
      </div>
    </div>
  )
}

export default CompanyDetails