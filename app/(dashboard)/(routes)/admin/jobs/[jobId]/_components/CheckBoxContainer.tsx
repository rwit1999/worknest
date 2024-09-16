import { Checkbox } from '@/components/ui/checkbox'
import React, { useEffect, useState } from 'react'

interface AppliedFilter {
  value: string,
  label: string,
  checked?: boolean
}

interface CheckBoxContainerProps {
  data: AppliedFilter[],
  onChange: (dataValues: string[]) => void
}

const CheckBoxContainer = ({ data, onChange }: CheckBoxContainerProps) => {

  const [filters, setFilters] = useState<AppliedFilter[]>(data)

  useEffect(() => {
    setFilters(data)
  }, [data])

  const handleCheckedChange = (applied: AppliedFilter) => {
    const updatedFilters = filters.map(item => {
      if (item.value === applied.value) {
        return {
          ...item,
          checked: !item.checked
        }
      }
      return item
    })

    setFilters(updatedFilters)

    onChange(
      updatedFilters.filter((item) => item.checked).map((item) => item.value)
    )
  }

  return (
    <div className="space-y-4 p-4 bg-white shadow-md rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Filter Options</h3>
      {filters.map((item) => (
        <label key={item.value} className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md cursor-pointer transition-all">
          <Checkbox 
            checked={item.checked || false} 
            onCheckedChange={() => handleCheckedChange(item)} 
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
          <span className="text-sm">{item.label}</span>
        </label>
      ))}
    </div>
  )
}

export default CheckBoxContainer
