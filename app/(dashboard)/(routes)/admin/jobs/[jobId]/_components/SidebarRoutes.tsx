'use client'

import { BookMarked, Compass, Home, List, User } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import DateFilter from "./DateFilter"
import CheckBoxContainer from "./CheckBoxContainer"
import qs from 'query-string'
import { useRouter } from "next/navigation"

const adminRoutes = [
    {
        icon: List,
        label: "Jobs",
        href: '/admin/jobs'
    },
    {
        icon: List,
        label: "Companies",
        href: '/admin/companies'
    },
    {
        icon: Compass,
        label: "Analytics",
        href: '/admin/analytics'
    },
]

const guestRoutes = [
    {
        icon: Home,
        label: "Home",
        href: '/'
    },
    {
        icon: Compass,
        label: "Search",
        href: '/search'
    },
    {
        icon: User,
        label: "Profile",
        href: '/user'
    },
    {
        icon: BookMarked,
        label: "Saved Jobs",
        href: '/savedJobs'
    },
]


const shiftTimingsData = [
    {
        value:"full-time",
        label:"Full Time"
    },
    {
        value:"part-time",
        label:"Part Time"
    },
    {
        value:"contract",
        label:"Contract"
    },
   
]

const SidebarRoutes = () => {
    const pathname = usePathname()
    const router = useRouter()

    const isAdminPage = pathname?.startsWith('/admin')
    const isSearchPage = pathname?.startsWith('/search')


    const routes = isAdminPage ? adminRoutes : guestRoutes

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleShiftTimingChange = (shiftTimings:any[])=>{

        const currentQueryParams=qs.parseUrl(window.location.href).query
        const newQueryParams = {
            ...currentQueryParams,
            shiftTiming:shiftTimings
        }

        const url=qs.stringifyUrl({
            url:pathname,
            query:newQueryParams
        },{skipNull:true,skipEmptyString:true})

        router.push(url)

    }

    return (
        <div className="w-64 h-screen p-5 bg-white shadow-lg">
            <nav className="space-y-4">
                {routes.map((route) => {
                    const Icon = route.icon
                    const isActive = pathname === route.href
                    
                    return (
                        <Link 
                            key={route.label} 
                            href={route.href}
                            className={`flex items-center p-3 rounded-md transition-all duration-300 
                            ${isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`
                            }
                        >
                            <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}/>
                            <span>{route.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {isSearchPage && (
                <div>
                    <Separator/>
                    <h2>Filters</h2>

                    {/* Datefilter */}
                    <DateFilter/>

                    <Separator/>

                    <h2>
                        Working Schedule
                    </h2>
                    <CheckBoxContainer data={shiftTimingsData} onChange={handleShiftTimingChange}/>

                </div>
            )}

        </div>
    )
}

export default SidebarRoutes
