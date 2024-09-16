import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/datatable'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { columns, CompanyColumns } from './_components/columns'
import { format } from 'date-fns'
import { db } from '@/lib/db'

const CompaniesOverviewPage = async() => {

    const {userId}=auth()
    if(!userId)return redirect('/')

    const companies = await db.company.findMany({
        where:{
            userId
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    const formattedCompanies: CompanyColumns[] = companies.map(company => ({
      id: company.id,
      name: company.name || "",
      logo: company.logo || "",
      createdAt: company.createdAt 
  }));
  

  return (
    <div>
      <div className='mb-11'>
        <Link href={'/admin/companies/create'}>
          <Button>Add Company</Button>
        </Link>
      </div>
      {/* data table */}

      <div className='mt-10'>
        <DataTable columns={columns} data={formattedCompanies} searchKey='name'/>
      </div>
      
    </div>
  )
}

export default CompaniesOverviewPage