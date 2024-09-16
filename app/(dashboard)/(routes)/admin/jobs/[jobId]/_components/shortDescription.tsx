'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage, Form } from '@/components/ui/form';
import getGenerativeAiResponse from '@/scripts/aistudio';
import { zodResolver } from '@hookform/resolvers/zod';
import { Job } from '@prisma/client';
import axios from 'axios';
import { Lightbulb, Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface ShortDescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  short_description: z.string().min(1),
});

const ShortDescriptionForm = ({ initialData, jobId }: ShortDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [prompt,setPrompt]=useState("")
  const [isPrompting,setIsPrompting]=useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      short_description: initialData?.short_description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success('Job updated');
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  const handlePromptGeneration=async ()=>{
      try{
        setIsPrompting(true)
        const customPrompt = `Could you craft a concise job description for a ${prompt} position in fewer than 400 characters` 

        await getGenerativeAiResponse(customPrompt).then((data)=>{
          form.setValue("short_description",data)
          setIsPrompting(false)
        })

      }catch(error){
        console.log(error);
        toast.error("Something went wrong...")
        
      }
  }

  return (
    <div className="w-full max-w-sm mb-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Short Description</h3>
        <Button
          onClick={toggleEditing}
          variant="ghost"
          className="text-sm text-gray-600 hover:text-blue-500 flex items-center transition-colors"
        >
          {isEditing ? 'Cancel' : (
            <>
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p>{initialData?.short_description}</p>
      )}

      {isEditing && <>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              placeholder="e.g., 'Full Stack Developer'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {isPrompting ? (
              <Button variant="outline" className="p-2">
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button onClick={handlePromptGeneration} variant="outline" className="p-2">
                <Lightbulb className="text-yellow-500" />
              </Button>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Note: Use the prompt generator to get a quick description idea.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={4}
                        placeholder="Enter a short description"
                        className="w-full  p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        </>} 
    </div>
  );
};

export default ShortDescriptionForm;
