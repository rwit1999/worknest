import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { userId: string, resumeId: string } }) {
  const { userId, resumeId } = params;

  try {
    // Update the user's profile with the active resume ID
    const updatedUserProfile = await db.UserProfile.update({
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
