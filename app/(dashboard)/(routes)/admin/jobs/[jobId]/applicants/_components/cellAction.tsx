'use client'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { BadgeCheck, Ban, Eye, Loader2, MoreHorizontal, Pencil } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { log } from 'console'
import axios from 'axios'


interface CellActionProps{
  id:string
  fullName:string
  email:string
}

const CellAction = ({id,fullName,email}:CellActionProps) => {

  const [isLoading,setIsLoading] = useState(false)
  const [isRejection,setIsRejection] = useState(false)

  const sendSelected = async()=>{
      setIsLoading(true)
      try{
        await axios.post('/api/sendSelected',{email,fullName})
        toast.success('Mail send')
        setIsLoading(false)
      }catch(error){
        console.log(error);
        toast.error('Something went wrong')
      }
  }
  const sendRejected =async ()=>{
    setIsLoading(true)
      try{
        await axios.post('/api/sendRejected',{email,fullName})
        toast.success('Mail send')
        setIsLoading(false)
      }catch(error){
        console.log(error);
        toast.error('Something went wrong')
      }
  }

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          {isLoading ? (
            <DropdownMenuItem className='flex items-center justify-center'>
              <Loader2 className='w-4 h-4 animate-spin'/>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem  onClick={sendSelected} className='flex items-center justify-center'>
              <BadgeCheck className='w-4 h-4 mr-2'/>
              Selected
            </DropdownMenuItem>
          )}

          {isRejection ? (
            <DropdownMenuItem className='flex items-center justify-center'>
              <Loader2 className='w-4 h-4 animate-spin'/>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={sendRejected} className='flex items-center justify-center'>
              <Ban className='w-4 h-4 mr-2'/>
              Rejected
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

export default CellAction