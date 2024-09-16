import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resumes } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {

  try {
    const { userId } = auth();


    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    const { resumes } = await req.json();

    if (
      !resumes ||
      !Array.isArray(resumes) ||
      resumes.length === 0
    ) {
      return new NextResponse("Invalid Resume Format", { status: 400 });
    }

    const createdresumes: Resumes[] = [];

    for (const resume of resumes) {
      const { url, name } = resume;

      //   check the resume with the same url is already exists for this resumeId

      const existingresume = await db.resumes.findFirst({
        where: {
          userProfileId:userId,
          url
        },
      });

      if (existingresume) {
        // skip the insertion
        console.log(
          `Resume with URL ${url} already exists for resumeId ${userId}`
        );
        continue;
      }

      // create a new resume
      
      const createdresume = await db.resumes.create({
        data: {
          url,
          name,
          userProfileId:userId,
        },
      });

      createdresumes.push(createdresume);
    }

    return NextResponse.json(createdresumes);
  } catch (error) {
    console.log(`[User_resume_POST] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};