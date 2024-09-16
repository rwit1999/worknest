'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Company } from '@prisma/client';
import axios from 'axios';
import { Mail, MapPin, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface ContactsFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  mail: z.string().min(3, { message: 'Mail is required' }),
  website: z.string().min(3, { message: 'Website is required' }),
  linkedIn: z.string().min(3, { message: 'LinkedIn is required' }),
  address_line_1: z.string().min(3, { message: 'Address Line 1 is required' }),
  address_line_2: z.string().min(3, { message: 'Address Line 2 is required' }),
  city: z.string().min(3, { message: 'City is required' }),
  zipcode: z.string().min(3, { message: 'Zipcode is required' }),
  state: z.string().min(3, { message: 'State is required' }),
});

const ContactsForm = ({ initialData, companyId }: ContactsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail: initialData?.mail || "",
      website: initialData?.website || "",
      linkedIn: initialData?.linkedIn || "",
      address_line_1: initialData?.address_line_1 || "",
      address_line_2: initialData?.address_line_2 || "",
      zipcode: initialData?.zipcode || "",
      state: initialData?.state || "",
      city: initialData?.city || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Submitting form with values:', values);
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success('Company updated');
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong');
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Company Contacts</h3>
        <Button
          onClick={toggleEditing}
          variant="outline"
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          {isEditing ? 'Cancel' : <><Pencil className="mr-1 h-4 w-4" /> Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            {initialData.mail && (
              <div className="flex items-center text-gray-700">
                <Mail className="mr-2 h-5 w-5 text-blue-600" />
                {initialData.mail}
              </div>
            )}
            {initialData.website && (
              <div className="flex items-center text-gray-700">
                <Mail className="mr-2 h-5 w-5 text-blue-600" />
                {initialData.website}
              </div>
            )}
            {initialData.linkedIn && (
              <div className="flex items-center text-gray-700">
                <Mail className="mr-2 h-5 w-5 text-blue-600" />
                {initialData.linkedIn}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            {initialData.address_line_1 && (
              <div className="flex items-start text-gray-700">
                <MapPin className="mr-2 h-5 w-5 text-red-600" />
                <div>
                  <p>{initialData.address_line_1}, {initialData.address_line_2}</p>
                  <p>{initialData.city}, {initialData.zipcode}, {initialData.state}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Mail: 'sample@gmail.com'"
                      className="border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Website link"
                      className="border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="LinkedIn link"
                      className="border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Address line 1"
                      className="border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Address line 2"
                      className="border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="City"
                        className="border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Zipcode"
                        className="border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="State"
                        className="border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ContactsForm;
