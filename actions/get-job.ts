import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { Category, Company, Job } from "@prisma/client"

type GetJobsProps = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  workmode?: string;
  yearsOfExperience?: string;
  savedJobs?:boolean
}

export const getJobs = async ({
  title,
  categoryId,
  createdAtFilter,
  shiftTiming,
  workmode,
  yearsOfExperience,
  savedJobs
}: GetJobsProps): Promise<(Job & { company: Company | null; category: Category | null })[]>=> {

  const { userId } = auth();

  try {
    // Initialize the query object with default where condition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      where: {
        isPublished: true, // Only published jobs
      },
      include: {
        company: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc", // Sort by creation date by default
      },
    };

    // Add filters dynamically based on the input parameters
    if (title) {
      query.where.title = {
        contains: title,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    if (categoryId) {
      query.where.categoryId = categoryId;
    }

    if (shiftTiming) {
      query.where.shiftTiming = shiftTiming;
    }

    if (workmode) {
      query.where.workmode = workmode;
    }

    if (yearsOfExperience) {
      query.where.yearsOfExperience = yearsOfExperience;
    }

    // custom date filter for `createdAt`
    if (createdAtFilter) {
      const currentDate = new Date()
      let startDate:Date
      switch(createdAtFilter){
        case "today":
          startDate=new Date(currentDate)
          break
        case "yesterday":
          startDate=new Date(currentDate)
          startDate.setDate(startDate.getDate()-1)
          break;
        case "thisWeek":
          startDate=new Date(currentDate)
          startDate.setDate(startDate.getDate()-currentDate.getDay())
          break;
        case "lastWeek":
          startDate=new Date(currentDate)
          startDate.setDate(startDate.getDate()-currentDate.getDay()-7)
          break;
        case "thisMonth":
          startDate=new Date(currentDate.getFullYear(),currentDate.getMonth(),1)
          break;

        default:
          startDate=new Date(0)
        
      }

      query.where.createdAt={
        gte:startDate
      }
    }

    if(savedJobs){
      query.where.savedUsers={
        has:userId
      }
    }

    // Execute the query
    const jobs = await db.job.findMany({
      where: query.where,
      include: {
        company: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    

    return jobs;
  } catch (error) {
    console.log(error);
    return [];
  }
}
