'use client';

import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage, Form } from '@/components/ui/form';
import getGenerativeAiResponse from '@/scripts/aistudio';
import { zodResolver } from '@hookform/resolvers/zod';
import { Company } from '@prisma/client';
import axios from 'axios';
import { Copy, Lightbulb, Loader2, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface companyOverviewProps {
  initialData: Company ;
  companyId: string;
}

const formSchema = z.object({
  overview: z.string().min(1),
});

const CompanyOverviewForm = ({ initialData, companyId }: companyOverviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [companyName,setCompanyName]=useState("")
  const [isPrompting,setIsPrompting]=useState(false)

  const [aiValue,setAiValue]=useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overview: initialData?.overview || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success('Company updated');
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
        const customPrompt = `Generate an overview content about ${companyName}. Include information about its history, purpose, features, user base , and impact on the industry. Focus on providing a comprehensive yet concise summary suitable for readers unfamiliar with the platform `

        await getGenerativeAiResponse(customPrompt).then((data)=>{
          data=data.replace(/^'|'s/g,"")
          const cleanedText = data.replace(/[\*\#]/g,"")
          // form.setValue('companyOverview',cleanedText)
          setAiValue(cleanedText)
          setIsPrompting(false)
        })
      }catch(error){
        console.log(error);
        toast.error("Something went wrong...")
        
      }
  }

  const onCopy=()=>{
    navigator.clipboard.writeText(aiValue)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="w-full mb-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Company Overview</h3>
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
        <div>
          {!initialData.overview && "No companyOverview"}
          {initialData.overview && (
            <Preview value={initialData.overview}/>
          )}
        </div>
      )}

      {isEditing && <>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              placeholder="e.g. 'SAP Labs'"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
            Note: Skills should be delimetted by comma.
          </p>

            {aiValue && (
              <div className='w-full h-96 overflow-y-scroll p-3 text-muted-foreground'>
                {aiValue}
                <Button  variant={'outline'} onClick={onCopy}>
                  <Copy className=' size-4'/>
                </Button>
              </div>
            )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field}/>
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

export default CompanyOverviewForm;
