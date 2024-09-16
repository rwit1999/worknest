import { storage } from '@/config/firebase.config'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { ImagePlus } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface ImageUploadProps{
    disabled?:boolean
    onChange:(value:string)=>void
    onRemove:(value:string)=>void
    value:string
}

const ImageUpload = ({onChange,value}:ImageUploadProps) => {

    const [isMounted,setIsMounted]=useState(false)
    const [isLoading,setIsLoading]=useState(false)
    const [progress ,setProgress]=useState<number>(0)

    useEffect(()=>{
        setIsMounted(true)
    },[])

    if(!isMounted)return null

    const onUpload = async (e:React.ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files)return
        const file:File = e.target.files[0]
        setIsLoading(true)

        const uploadTask = uploadBytesResumable(
            ref(storage,`CompanyLogo/${Date.now()}-${file?.name}`),
            file,
            {contentType:file?.type}
        )

        uploadTask.on('state_changed',(snapshot)=>{
            setProgress((snapshot.bytesTransferred/snapshot.totalBytes)*100)
        },(error)=>{
            toast.error(error.message)
        },()=>{
            getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl=>{
                onChange(downloadUrl)
                setIsLoading(false)
                toast.success('Image Uploaded') 
            })
        })

    }

  return (
    <div>
        {value ? <>
        <div>
            <Image
                fill
                alt='Logo'
                src={value}
            />
        </div>
        </> : <>
            <div>
                {isLoading ? (
                    <>
                        <p>{`${progress.toFixed(2)}%`}</p>
                    </>
                ):(
                    <>
                        <label>
                            <div>
                                <ImagePlus/>
                                <p>Upload an image</p>
                                <input type="file" accept='image/*' onChange={onUpload}/>
                            </div>
                        </label>
                    </>
                )}
            </div>
        </>}
    </div>
  )
}

export default ImageUpload