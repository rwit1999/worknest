"use client";

import { Job, Company } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Box from "@/components/box";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, BookMarked, BriefcaseBusiness, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface JobCardItemProps {
  job: Job;
  userId: string | null;
}

const JobCardItem = ({ job, userId }: JobCardItemProps) => {
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const isSavedByUser = userId && job.savedUsers?.includes(userId)

  const typeJob = job as Job; // Assert 'job' as type 'Job'
  const company = typeJob?.company || null; // Safely access 'company' property

  const router= useRouter()

  const saveJob=async()=>{
    try{
        setIsBookmarkLoading(true)
        if(isSavedByUser){
            await axios.patch(`api/jobs/${job.id}/removeJobFromCollection`)
            toast.success('Job removed')
        }
        else{
            await axios.patch(`api/jobs/${job.id}/saveJobToCollection`)
            toast.success('Job saved')
        }
    }catch(error){
        console.log(error);
        toast.error('Something went wrong')
    }finally{
        setIsBookmarkLoading(false)
        router.refresh()
    }
  }

  return (
    <div className="mb-6">
      <Card className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
        <div className="space-y-4">
          {/* Job posted date and bookmark button */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(job.createdAt))} ago
            </p>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => setIsBookmarkLoading(true)}
            >
              {isBookmarkLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <div onClick={saveJob}>
                    {isSavedByUser ? 
                        <BookmarkCheck className="w-5 h-5" /> : 
                        <Bookmark className="w-5 h-5" />
                    }
                    
                </div>
                
              )}
            </Button>
          </div>

          {/* Company details */}
          <div className="flex items-center space-x-4">
            {company?.logo && (
              <Image
                alt={company?.name}
                src={company?.logo}
                width={40}
                height={40}
                className="object-contain rounded-full"
              />
            )}

            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900">{job.title}</p>
              {company && (
                <Link
                  href={`/company/${company.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {company?.name}
                </Link>
              )}
            </div>
          </div>

          {/* Job shift timing */}
          {job.shiftTiming && (
            <div className="flex items-center space-x-2 text-gray-600">
              <BriefcaseBusiness className="w-5 h-5" />
              <span>{job.shiftTiming}</span>
            </div>
          )}

          {/* Job description */}
          {job.short_description && (
            <CardDescription className="text-gray-700">
              {truncate(job.short_description, {
                length: 180,
                omission: "...",
              })}
            </CardDescription>
          )}

          {/* Job tags */}
          {job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.tags.slice(0, 6).map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div >
            <div className="flex justify-between">
                <Link href={`/search/${job.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Details
                    </Button>
                </Link>
                <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-100"
                    onClick={saveJob}
                >
                    {isSavedByUser ? "Saved":"Save For Later"}
                </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobCardItem;
