import { Button } from '@/components/ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import React from 'react'

interface CategoryListItemProps {
  label: string
  value: string
}

const CategoryListItem = ({ label, value }: CategoryListItemProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategoryId = searchParams.get('categoryId')
  const currentTitle = searchParams.get('title')

  const isSelected = currentCategoryId === value

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    )
    router.push(url)
  }

  return (
    <Button
      onClick={onClick}
      className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
        isSelected
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      {label}
    </Button>
  )
}

export default CategoryListItem
