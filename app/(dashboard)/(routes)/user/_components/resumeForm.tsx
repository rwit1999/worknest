"use client";

import { AttachmentsUploads } from "@/components/attachmentUpload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resumes, UserProfile } from "@prisma/client";
import axios from "axios";
import { File, Loader2, Pencil, ShieldCheck, ShieldX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ResumeFormProps {
  initialData: UserProfile & { resumes: Resumes[] };
  userId: string;
}

const formSchema = z.object({
  resumes: z
    .object({
      url: z.string().url(),
      name: z.string(),
    })
    .array(),
});

export const ResumeForm = ({ initialData, userId }: ResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const router = useRouter();

  const initialResumes =
    initialData?.resumes?.map((item) => ({
      url: item.url,
      name: item.name,
    })) || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumes: initialResumes,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/users/${userId}/resumes`, values);
      toast.success("Resume updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.error((error as Error)?.message);
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const onDelete = async (resume: Resumes) => {
    try {
      setDeletingId(resume.id);

      if (initialData.activeResumeId === resume.id) {
        toast.error("Cannot delete an active resume");
        return;
      }

      await axios.delete(`/api/users/${userId}/resumes/${resume.id}`);
      toast.success("Resume Removed");
      router.refresh();
    } catch (error) {
      console.error((error as Error)?.message);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const activateResume = async (resumeId: string) => {
    setActiveResumeId(resumeId);

    try {
      const response = await axios.patch(`/api/users/${userId}`, {
        activeResumeId: resumeId,
      });
      toast.success("Resume activated");
      router.refresh();
    } catch (error) {
      console.error((error as Error)?.message);
      toast.error("Something went wrong");
    } finally {
      setActiveResumeId(null);
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4 shadow-sm">
      <div className="font-medium flex items-center justify-between">
        Your Resumes
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display the Resume if not editing */}
      {!isEditing && (
        <div className="space-y-2">
          {initialData?.resumes.map((item) => (
            <div
              key={item.url}
              className="grid grid-cols-12 items-center gap-2 p-3 bg-white rounded-md border hover:shadow-md transition-all duration-150"
            >
              <div className="flex items-center col-span-10 space-x-3">
                <File className="w-5 h-5 text-gray-500" />
                <p className="text-sm font-medium text-gray-700 truncate">
                  {item.name}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="col-span-2 flex justify-end space-x-2">
                {activeResumeId === item.id ? (
                  <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                ) : (
                  <Button
                    variant={
                      initialData.activeResumeId === item.id
                        ? "outline"
                        : "ghost"
                    }
                    onClick={() => activateResume(item.id)}
                    className={`flex items-center space-x-1 px-4 py-1 ${
                      initialData.activeResumeId === item.id
                        ? "border-green-500 text-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    <p>
                      {initialData.activeResumeId === item.id
                        ? "Live"
                        : "Activate"}
                    </p>
                    {initialData.activeResumeId === item.id ? (
                      <ShieldCheck className="w-4 h-4 ml-2" />
                    ) : (
                      <ShieldX className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                )}

                {deletingId === item.id ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1"
                    disabled
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item)}
                    className="p-1"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* On editing mode display the input */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(resumes) => field.onChange(resumes)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
