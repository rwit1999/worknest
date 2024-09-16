import React from 'react';
import Navbar from './(routes)/admin/jobs/[jobId]/_components/Navbar';
import Sidebar from './(routes)/admin/jobs/[jobId]/_components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col">
      <header>
        <Navbar />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 fixed inset-y-0 z-50 bg-gray-800 text-white">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 lg:ml-72 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
