"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"
import clsx from "clsx"

export type JobsColumns = {
  id: string
  title: string
  company: string
  category: string
  createdAt: string
  isPublished: boolean
}

export const columns: ColumnDef<JobsColumns>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "isPublished",
    header: "Published",
    cell: ({ row }) => {
      const { isPublished } = row.original
      return (
        <span
          className={clsx(
            "px-2 py-1 rounded-full text-xs font-semibold",
            isPublished
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          )}
        >
          {isPublished ? "Published" : "Unpublished"}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <Link href={`/admin/jobs/${id}`}>
              <DropdownMenuItem className="flex items-center space-x-2">
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </Link>
            <Link href={`/admin/jobs/${id}/applicants`}>
              <DropdownMenuItem className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Applicants</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
