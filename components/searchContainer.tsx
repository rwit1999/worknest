'use client'
import { useDebounce } from '@/hooks/useDebounce'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import qs from 'query-string'

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input
            className={`border-none focus:outline-none focus:ring-0 focus:border-transparent ${className}`}
            {...props}
        />
    )
}



const SearchContainer = () => {

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const currentCategoryId=searchParams.get("categoryId")
    const currentTitle=searchParams.get("title")
    const createdAtFilter=searchParams.get("createdAtFilter")
    const currentShiftTiming=searchParams.get("shiftTiming")
    const currentWorkMode=searchParams.get("workMode")

    const [value, setValue] = useState(currentTitle || "")

    const debounceValue = useDebounce(value)

    useEffect(()=>{
        const url = qs.stringifyUrl({
            url:pathname,
            query:{
                title:debounceValue,
                categoryId:currentCategoryId,
                createdAtFilter:createdAtFilter,
                shiftTiming:currentShiftTiming,
                workMode:currentWorkMode
            }
        },{skipNull:true,skipEmptyString:true})

        router.push(url)

    },[debounceValue,currentCategoryId,router,pathname,createdAtFilter,currentShiftTiming,currentWorkMode])

    return (
        <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md overflow-hidden max-w-md mx-auto">
            {/* Search Icon */}
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 border-r border-gray-300">
                <Search className="text-gray-500 w-6 h-6" />
            </div>
            
            {/* Input Field */}
            <Input
                className="flex-1 py-2 px-3 text-sm placeholder-gray-500"
                placeholder='Search for a job'
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}

export default SearchContainer
