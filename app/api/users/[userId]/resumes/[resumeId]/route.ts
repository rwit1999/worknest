import { storage } from "@/config/firebase.config";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request, 
  { params }: { params: { resumeId: string } }
) => {
  try {
    const { userId } = auth();
    const { resumeId } = params;
    
    // console.log(userId);
    // console.log(resumeId);
    
    

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    // Fetch the resume by its unique id
    const resume = await db.resumes.findUnique({
      where: {
        id: resumeId,
      },
    });

    // Ensure the resume exists and belongs to the user
    if (!resume || resume.userProfileId !== userId) {    
      return new NextResponse("Resume not found", { status: 404 });
    }

    // delete from Firebase storage
    const storageRef = ref(storage, resume.url);
    await deleteObject(storageRef);

    // delete from the database
    await db.resumes.delete({
      where: {
        id: resumeId,
      },
    });

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.log(`[Resume_DELETE] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
