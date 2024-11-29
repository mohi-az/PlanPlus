"use client"
import { CategoryContext, CategoryProvider } from '@/contexts/categoryContext'
import React, { useContext } from 'react'
import CategoriesList from './categoriesList'
import TableSkeleton from '@/lib/skeletons/table'
export default function Page() {
  const { isPending } = useContext(CategoryContext)

  return (
    <div className='w-full p-5 h-remain overflow-y-hidden'>
      <CategoryProvider >
        <div className=" rounded-md p-3 bg-base-300 h-AdividerWithoutBTN"  >
          {isPending ? <TableSkeleton />
            :
            <CategoriesList />
          }
        </div>

      </CategoryProvider>
    </div>
  )
}
