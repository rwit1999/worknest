'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const formSchema = z.object({
  name: z.string().min(3, { message: "Company name can't be empty" }),
})

const CompanyCreatePage = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const {isSubmitting,isValid} = form.formState 
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      const response =await axios.post('/api/companies',values)
      router.push(`/admin/companies/${response.data.id}`)
      toast.success('Company created')
      
    }catch(error){
      console.log((error as Error)?.message);
      // toast notification
      
      
    }
  }

  return (
    <div className="ml-[-15rem] mt-[-2rem] flex items-center justify-center min-h-screen ">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Name of the Company</h1>
        <p className="text-gray-600 mb-6">
          What would you like to name your Company? You can change this later.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold mb-2">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. SAP Labs"
                      {...field}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm rounded-lg px-4 py-2 w-full"
                    />
                  </FormControl>
                  <FormDescription>Name of this Company</FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className="mt-6 flex justify-end gap-4">
                <Link href={'/admin/Companys'}>
                    <button
                    type="button"
                    className="bg-gray-100 text-gray-600 font-semibold py-2 px-6 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all duration-200 ease-in-out"
                    >
                    Cancel
                    </button>
                </Link>
                
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={`py-2 px-6 rounded-lg bg-blue-500 font-semibold text-white`}
                >
                   Continue
                </button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default CompanyCreatePage
