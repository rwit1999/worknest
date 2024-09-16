'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface CompanyDescriptionFormProps {
  initialData: {
    description: string;
  };
  companyId: string;
}

const formSchema = z.object({
  description: z.string().min(3, { message: 'Description is missing' }),
});

const CompanyDescriptionForm = ({ initialData, companyId }: CompanyDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialData.description); // Track the description in state
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description, // Use initial description in form
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      toast.success('Company updated');
      setDescription(values.description); // Update the description in state
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="w-full max-w-sm mb-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Company Description</h3>
        <Button
          onClick={toggleEditing}
          variant="ghost"
          className="text-sm text-gray-600 hover:text-blue-500 flex items-center transition-colors"
        >
          {isEditing ? 'Cancel' : <>
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </>
          }
        </Button>
      </div>

      {/* Display the description when not editing */}
      {!isEditing && <p className="text-gray-700 text-sm">{description || 'No description available'}</p>}

      {/* Show input field when editing */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'Add company description'"
                      className="border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...field}
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

export default CompanyDescriptionForm;
