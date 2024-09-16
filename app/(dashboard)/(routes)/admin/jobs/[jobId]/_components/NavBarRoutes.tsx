'use client'

import SearchContainer from "@/components/searchContainer"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavBarRoutes = () => {
    const pathname = usePathname()

    const isAdminPage = pathname?.startsWith('/admin')
    const isPlayerPage = pathname?.startsWith('/jobs')
    const isSearchPage = pathname?.startsWith('/search')

    return (
        <div className="flex items-center justify-end space-x-4 p-4 bg-white shadow-lg rounded-md">

            {/* {isSearchPage && (
                <div>
                    <SearchContainer/>
                </div>
            )} */}

            <div className="flex items-center space-x-3">
                {isAdminPage || isPlayerPage ? (
                    <Link href={'/'}>
                        <Button className="flex items-center space-x-2 bg-red-500 text-white hover:bg-red-600 transition-colors duration-300">
                            <LogOut className="w-5 h-5"/>
                            <span>Exit</span>
                        </Button>
                    </Link>
                ) : (
                    <Link href={'/admin/jobs'}>
                        <Button className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300">
                            <LogOut className="w-5 h-5"/>
                            <span>Recruiter mode</span>
                        </Button>
                    </Link>
                )}
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    )
}

export default NavBarRoutes
