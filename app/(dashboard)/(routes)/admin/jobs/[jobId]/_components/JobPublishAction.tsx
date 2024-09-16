'use client'

import { Button } from "@/components/ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface JobPublishActionProps {
    disabled: boolean,
    jobId: string,
    isPublished: boolean
}

const JobPublishAction = ({ disabled, jobId, isPublished }: JobPublishActionProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onClick = async () => { // publish or unpublish
        try{
            setIsLoading(true)
            if(isPublished){
                await axios.patch(`/api/jobs/${jobId}/unpublish`)
                toast.success("Job Unpublished")
            }
            else{
                await axios.patch(`/api/jobs/${jobId}/publish`)
                toast.success("Job Published")
            }
            router.refresh()

        }catch(error){
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    const onDelete = async() => {
        try{
            setIsLoading(true)
            await axios.delete(`/api/jobs/${jobId}`)
            toast.success("Job deleted")
            router.refresh()
            return router.push('/admin/jobs')

        }catch(error){
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="flex space-x-4">
            <Button
                variant="outline"
                onClick={onClick}
                disabled={disabled || isLoading}
                className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600"
            >
                {isPublished ? "Remove Job Post" : "Post Job"}
            </Button>

            <Button
                variant="destructive"
                onClick={onDelete}
                disabled={isLoading}
                className="bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600"
            >
                <Trash className="mr-2" size={'sm'} />
                Delete
            </Button>
        </div>
    )
}

export default JobPublishAction
