'use client';

import { Button } from '@/components/ui/button';
import getGenerativeAiResponse from '@/scripts/aistudio';
import { zodResolver } from '@hookform/resolvers/zod';
import { Job } from '@prisma/client';
import axios from 'axios';
import { Lightbulb, Loader2, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isPrompting, setIsPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting } = form.formState;

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

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Generate an array of top 10 keywords related to the job profession ${prompt} . These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. The output should be a list/array of keywords. Just return me the array alone`;

      await getGenerativeAiResponse(customPrompt).then((data) => {
        // Check if the data response is an array
        if (Array.isArray(JSON.parse(data))) {
          setJobTags((prevTags) => [...prevTags, ...JSON.parse(data)]);
        }
        form.setValue('tags', data);
        setIsPrompting(false);
      });
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong...');
    }
  };

  const handleTagRemove = (idx: number) => {
    const updatedTags = [...jobTags];
    updatedTags.splice(idx, 1);
    setJobTags(updatedTags);
  };

  return (
    <div className="w-[20rem] ml-[-3rem] bg-white rounded-lg mb-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className=" font-semibold text-gray-800">Job Tags</h3>
        <Button
          onClick={toggleEditing}
          variant="ghost"
          className="text-sm text-gray-600 hover:text-blue-500 flex items-center transition-colors"
        >
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <div className="flex flex-wrap gap-2">
          {jobTags.length > 0 ? (
            jobTags.map((tag, idx) => (
              <div
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tags</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
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
              <Button
                onClick={handlePromptGeneration}
                variant="outline"
                className="p-2"
              >
                <Lightbulb className="text-yellow-500" />
              </Button>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Note: Enter a profession name to generate the tags.
          </p>

          <div className="flex flex-wrap gap-2">
            {jobTags.length > 0 ? (
              jobTags.map((tag, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center space-x-2 text-sm"
                >
                  <span>{tag}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleTagRemove(idx)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tags</p>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => {
                setJobTags([]);
                onSubmit({ tags: [] });
              }}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white transition-all"
            >
              Clear All
            </Button>
            <Button
              disabled={isSubmitting}
              type="submit"
              onClick={() => onSubmit({ tags: jobTags })}
              className="bg-blue-500 hover:bg-blue-600 text-white transition-all"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsForm;
