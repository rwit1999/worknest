'use client'

import { Resumes, UserProfile } from "@prisma/client";
import { useEffect, useState } from "react";
import { Modal } from "./modal";
import Link from "next/link";
import { Button } from "./button";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

const ApplyModal = ({ isOpen, onClose, onConfirm, loading, userProfile }: ApplyModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="space-y-2 text-gray-800">
          <label className="block text-lg font-semibold">{userProfile?.fullName}</label>
          <label className="block text-sm text-gray-600">{userProfile?.email}</label>
          <label className="block text-sm text-gray-600">{userProfile?.contact}</label>

          <label className="block text-lg font-semibold">
            Your active resume: 
            <span className="ml-2 text-gray-700 font-normal">
              {userProfile?.resumes.find((resume) => resume.id === userProfile?.activeResumeId)?.name || "No resume selected"}
            </span>
          </label>

          <div className="text-sm text-blue-600 mt-2">
            Change your details{' '}
            <Link href="/user" className="underline hover:text-blue-800">
              over here
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <Button onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
          Cancel
        </Button>
        <Button onClick={onConfirm} className={`bg-blue-600 text-white hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
          {loading ? "Loading..." : "Continue"}
        </Button>
      </div>
    </Modal>
  );
}

export default ApplyModal;
