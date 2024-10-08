'use client';

import { Button } from '@/components/ui/button';
import ComboBox from '@/components/ui/comboBox';
import { FormControl, FormField, FormItem, FormMessage, Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Job } from '@prisma/client';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface ShiftTimingFormProps {
  initialData: Job;
  jobId: string;
}

const options=[
  {
    value:"full-time",
    label:"Full-time"
  },
  {
    value:"part-time",
    label:"Part-time"
  },
  {
    value:"contract-time",
    label:"Contract-time"
  },
]

const formSchema = z.object({
  shiftTiming: z.string().min(1),
});

const ShiftTimingForm = ({ initialData, jobId }: ShiftTimingFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shiftTiming: initialData?.shiftTiming || "",
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

  const selectedOption = options.find(option => option.value === form.getValues('shiftTiming'));

  return (
    <div className="w-full max-w-sm mb-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Job Shift Timing</h3>
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
        <p className="text-gray-700 text-sm">
          {selectedOption?.label || 'No timing added'}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="shiftTiming"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      options={options}
                      value={field.value}
                      onChange={field.onChange} // Correctly bind the onChange event
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
      )}
    </div>
  );
};

export default ShiftTimingForm;
