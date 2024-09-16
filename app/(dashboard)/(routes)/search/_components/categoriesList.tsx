'use client'
import { Category } from '@prisma/client'
import React from 'react'
import CategoryListItem from './categoriesListItem'

interface CategoriesListProps {
    categories: Category[]
}

const CategoriesList = ({ categories }: CategoriesListProps) => {

    return (
        <div className="flex space-x-4 overflow-x-auto py-3 px-3">
            {categories.map((category,idx) => (
                <CategoryListItem
                    key={idx}
                    label={category.name}
                    value={category.id}
                />
            ))}
        </div>
    )
}

export default CategoriesList
