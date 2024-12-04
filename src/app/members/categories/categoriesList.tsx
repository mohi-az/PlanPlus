"use client"
import { CategoryContext } from '@/contexts/categoryContext';
import IconLoader from '@/lib/components/IconLoader';
import { CategorySchema } from '@/lib/schemas/taskSchema';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react'
import { FcWorkflow } from 'react-icons/fc';
import { toast } from 'react-toastify';

export default function CategoriesList() {
    let RowNo = 1;
    const [selectedIcon, setSelectedIcon] = useState<string | null>();
    const [selectedCategory, setSelectedCategory] = useState<category | null>();
    const [isChecked, setIsChecked] = useState(false);
    const { categories, addCategory, isPending, updateCategory, deleteCategory } = useContext(CategoryContext)
    const IconList = ['FcList', 'FcMoneyTransfer', 'FcSlrBackSide', 'FcSalesPerformance', 'FcFactory', 'FcAdvance', 'FcAlarmClock', 'FcAdvertising', 'FcSportsMode', 'FcLikePlaceholder', 'FcTimeline', 'FcShare', 'FcShop', 'FcReading', 'FcPaid', 'FcLike', 'FcInvite', 'FcHome', 'FcGraduationCap', 'FcGlobe', 'FcFlashOn', 'FcEngineering', 'FcElectroDevices', 'FcDislike', 'FcComboChart', 'FcClapperboard', 'FcBookmark', 'FcBriefcase']
    const ClickHandler = async (formData: FormData) => {
        const categoryData = {
            name: formData.get('name'), description: formData.get('description'),
            icon: selectedIcon, showInMenu: formData.get('showInMenu') === 'on' ? true : false
        }

        const validatedData = CategorySchema.safeParse(categoryData)
        if (validatedData.success) {
            if (selectedCategory?.id) {
                const response = await updateCategory({ ...validatedData.data, id: selectedCategory?.id })
                if (response.status === "success") {
                    toast("The category has been successfully updated!")
                    setSelectedCategory(null)
                }
            }
            else {
                const response = await addCategory(validatedData.data)
                if (response.status === "success")
                    toast("The category has been added successfully!")
                
            }
        }
    }
    useEffect(() => {
        if (selectedCategory) {
            setIsChecked(selectedCategory.showInMenu);
            setSelectedIcon(selectedCategory.icon)
        }
    }, [selectedCategory]);

    const deleteHandler = async (cat: category) => {
        const response = await deleteCategory(cat)
        if (response.status = "success")
            toast("The category has been deleted successfully!")

    }
    return (
        <div className="overflow-x-auto  flex flex-col  lg:flex-row gap-6 h-full">
            <form action={ClickHandler} className='flex flex-col  form-control gap-2 px-5  w-full lg:w-1/3 h-2/5 lg:h-full  rounded-md bg-base-200'>

                <div className="label">
                    <span className="label-text">Category name : </span>
                </div>

                <input type='text' required className='input input-sm input-bordered' name='name'
                    defaultValue={selectedCategory?.name && selectedCategory.name} />
                <div className="label">
                    <span className="label-text">Description : </span>
                </div>
                <input type='text' className='input  input-sm input-bordered' name='description'
                    defaultValue={selectedCategory?.description ? selectedCategory.description : ''} />
                <div className='bg-base-300 p-2 mt-5'>
                    Icons:
                    <div className=' flex flex-row text-base md:text-2xl lg:text-4xl gap-1 md:gap-2 flex-wrap justify-center'>

                        {
                            IconList.map(i => <div key={i} className={clsx('border-1 cursor-pointer border-slate-500 hover:border-primary',
                                (selectedIcon === i || i === selectedCategory?.icon) && 'border-2 border-warning')}
                                onClick={() => { setSelectedIcon(i) }}><IconLoader name={i} /></div>)
                        }
                    </div>
                </div>
                <div>
                    <label className="cursor-pointer label justify-start gap-3">
                        <span className="label-text"> Show in the menu</span>
                        <input type="checkbox" className="checkbox checkbox-success" name='showInMenu'
                            checked={isChecked} onChange={() => setIsChecked(prev => !prev)} />
                    </label>
                </div>
                <div className='flex lg:flex-col flex-row  gap-4 justify-end  pb-10'>
                    <button className="btn btn-accent btn-outline w-1/3 lg:w-full btn-sm md:btn-md">{selectedCategory ? 'Update' : 'Add Category'}</button>
                    {selectedCategory &&
                        <button className="btn btn-ghost btn-outline w-1/3 lg:w-full btn-sm md:btn-md " onClick={() => setSelectedCategory(null)}>Cancel</button>}
                </div>
            </form>
            <div className='w-full lg:w-2/3 h-3/5 lg:h-full rounded-md bg-base-200 p-5'>
                {!isPending ?
                    <table className="table-xs table-zebra md:table-md lg:table-md w-full  text-left">
                        <thead>
                            <tr>
                                <th></th>
                                <th className='lg:font-semibold text-sm lg:text-lg'>Name</th>
                                <th className='lg:font-semibold text-sm lg:text-lg '>Icon</th>
                                <th className='lg:font-semibold text-sm lg:text-lg'>Category Description</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories &&
                                categories.map(cat =>
                                    <tr key={cat.id} className='w-full hover h-6 overflow-y-scroll'>
                                        <td>{RowNo++}</td>
                                        <td>{cat.name}</td>
                                        <td className=' text-base md:text-lg lg:text-2xl '> {
                                            cat.icon ? <IconLoader name={cat.icon} /> : <FcWorkflow />}</td>
                                        <td> {cat.description}</td>
                                        <td className='hover:cursor-pointer hover:text-primary' onClick={() => setSelectedCategory(cat)}>Edit</td>
                                        <td className='hover:cursor-pointer hover:text-primary' onClick={() => deleteHandler(cat)}>Delete</td>
                                    </tr>
                                )
                            }


                        </tbody>
                    </table>
                    :
                    <div className='flex flex-col h-full justify-center w-full '>

                        <span className="loading loading-bars loading-md m-auto"></span>
                    </div>
                }
            </div>
        </div>
    )
}
