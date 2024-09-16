"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import CellAction from "./cellAction"
import { File } from "lucide-react"

export type ApplicantColumns = {
  id: string
  fullName: string
  email: string
  contact: string
  appliedAt: string
  resume:string
  resumeName:string
}

export const columns: ColumnDef<ApplicantColumns>[] = [
  {
    accessorKey: "fullName",
    header: "FullName",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "resume",
    header: "Resume",
    cell:({row})=>{
      const {resume,resumeName}=row.original
      return (
        <Link href={resume} target="_blank" className="flex items-center text-purple-800">
          <File className="w-4 h-4 mr-2"/>
          <p className="w-44 truncate">{resumeName}</p>
        </Link>
      )
    }
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "appliedAt",
    header: "Applied Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id,fullName,email } = row.original
      return <CellAction id={id} email={email} fullName={fullName}/>
    },
  },
]
