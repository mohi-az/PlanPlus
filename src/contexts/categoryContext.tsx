"use client"
import { AddCategory, DeleteCategory, GetTaskCategories, UpdateCategory } from "@/app/actions/userActions";
import { createContext, useEffect, useState } from "react"
type contextType = {
    categories: category[],
    addCategory: (category: category) => Promise<ActionResult<category>>
    updateCategory: (category: category) => Promise<ActionResult<category>>
    deleteCategory: (category: category) => Promise<ActionResult<boolean>>
    isPending: boolean
}
const initValues: contextType = {
    categories: [],
    addCategory: async () => ({ status: "error", error: "" }),
    updateCategory: async () => ({ status: "error", error: "" }),
    deleteCategory: async () => ({ status: "error", error: "" }),
    isPending: false
}
export const CategoryContext = createContext(initValues);
export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [categories, setCategories] = useState<category[]>([]);
    const [isPending, setIsPending] = useState(false);

    const GetCategories = async () => {
        setIsPending(true)
        const respoinse = await GetTaskCategories();
        setIsPending(false)
        if (respoinse.status === "success")
            setCategories(respoinse.data)
        return
    }
    useEffect(() => {
        GetCategories();
    }, [])
    const addCategory = async (category: category): Promise<ActionResult<category>> => {

        const response = await AddCategory(category);
        if (response.status === "success") {
            GetCategories();
            return response
        }
        else return response
    }
    const updateCategory = async (category: category): Promise<ActionResult<category>> => {
        const response = await UpdateCategory(category);
        if (response.status === "success") {
            GetCategories();
            return response
        }
        else return response
    }
    const deleteCategory = async (category: category): Promise<ActionResult<boolean>> => {
        const response = await DeleteCategory(category);
        if (response.status === "success") {
            GetCategories();
            return response
        }
        else return response
    }
    return (
        <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, isPending }}>
            {children}
        </CategoryContext.Provider>
    )
}