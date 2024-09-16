"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Pencil, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface EmailFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
});

const EmailForm = ({ initialData, userId }: EmailFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData?.email || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/users/${userId}`, values);
      toast.success('Profile updated');
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6 max-w-lg mx-auto">
      {!isEditing && (
        <div className="flex items-center space-x-4">
          <UserCircle className="w-12 h-12 text-gray-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {initialData?.email ? initialData.email : "No email"}
            </h2>
            <p className="text-sm text-gray-500">User Email</p>
          </div>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'sample@gmail.com'"
                      className="border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}

      <Button
        onClick={toggleEditing}
        className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
      >
        {isEditing ? "Cancel" : (
          <>
            <Pencil className="mr-2 w-4 h-4" />
            Edit
          </>
        )}
      </Button>
    </div>
  );
};

export default EmailForm;
