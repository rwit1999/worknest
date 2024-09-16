import { auth, currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import NameForm from './_components/nameForm';
import { db } from '@/lib/db';
import EmailForm from './_components/emailForm';
import ContactForm from './_components/contactForm';
import { ResumeForm } from './_components/resumeForm';

const ProfilePage = async () => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) redirect('/sign-in');

  const profile = await db.UserProfile.findUnique({
    where: {
      userId,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-4 mb-8">
        {user?.hasImage && (
          <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <Image fill alt="User Profile Pic" src={user.imageUrl} />
          </div>
        )}
        <div className="text-lg font-semibold text-gray-700">
          <h1 className="text-2xl">Hello, {profile?.fullName || 'User'}!</h1>
          <p className="text-gray-500">{profile?.email || 'No email provided'}</p>
        </div>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Update Name</h2>
          <NameForm initialData={profile} userId={userId} />
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Update Email</h2>
          <EmailForm initialData={profile} userId={userId} />
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Update Contact</h2>
          <ContactForm initialData={profile} userId={userId} />
        </div>

        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Upload Resume</h2>
          <ResumeForm initialData={profile} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
