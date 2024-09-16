import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust this to your Prisma setup

export async function POST(req: Request, { params }: { params: { userId: string, resumeId: string } }) {
  const { userId, resumeId } = params;

  try {
    // Update the user's profile with the active resume ID
    const updatedUserProfile = await prisma.userProfile.update({
      where: {
        userId,
      },
      data: {
        activeResumeId: resumeId,
      },
    });

    return NextResponse.json(updatedUserProfile);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to activate resume", { status: 500 });
  }
}
