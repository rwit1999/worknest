'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import qs from 'query-string'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search } from "lucide-react"

const HomeSearchContainer = () => {
  const router = useRouter()
  const [title, setTitle] = useState("")

  const handleClick = () => {
    const href = qs.stringifyUrl({
      url: '/search',
      query: {
        title: title || undefined
      }
    })
    router.push(href)
  }

  return (
    <div className="w-full flex items-center justify-center mt-8">
      <div className="flex w-full max-w-2xl items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
        {/* Input field */}
        <Input
          placeholder="Search by job name"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Search Button */}
        <Button 
          onClick={handleClick} 
          disabled={!title}
          className={`px-6 py-2 rounded-lg transition-colors duration-300 ${title ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

export default HomeSearchContainer
