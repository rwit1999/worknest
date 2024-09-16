'use client';

import ImageUpload from '@/components/imageUpload';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage, Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Company } from '@prisma/client';
import axios from 'axios';
import { ImageIcon, Pencil } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface LogoFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  logo: z.string().optional(),
});

const CompanyLogoForm = ({ initialData, companyId }: LogoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: initialData?.logo || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Save the logo URL in the database
      const response = await axios.patch(`/api/companies/${companyId}`, { ...values });
      toast.success('Company updated');
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
        <h3 className="text-lg font-semibold text-gray-800">Company Logo</h3>
        <Button
          onClick={toggleEditing}
          variant="ghost"
          className="text-sm text-gray-600 hover:text-blue-500 flex items-center transition-colors"
        >
          {isEditing ? 'Cancel' : <>
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </>}
        </Button>
      </div>

      {/* Display existing logo or image preview */}
      {!isEditing && (
        <div className="flex items-center justify-center mb-4">
          {!initialData.logo ? (
            <div className="flex items-center justify-center w-32 h-32 bg-gray-100 border border-gray-300 rounded">
              <ImageIcon className="w-16 h-16 text-gray-400" />
            </div>
          ) : (
            <div className="relative w-32 h-32">
              <Image
                alt="Logo"
                src={initialData?.logo || '/placeholder-image.png'}
                layout="fill"
                objectFit="contain"
                className="rounded object-contain"
              />
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                      className="w-full h-32"  // Set fixed size for the upload preview
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

export default CompanyLogoForm;
