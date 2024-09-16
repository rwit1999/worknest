import React from 'react'
import NavBarRoutes from './NavBarRoutes'
import MobileSidebar from './MobileSidebar'

const Navbar = () => {
  return (
      <div>
        {/* mobile sidebar */}
         
        <MobileSidebar/>

        <NavBarRoutes/>


    </div>
  )
}

export default Navbar