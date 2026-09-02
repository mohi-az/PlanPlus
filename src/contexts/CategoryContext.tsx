"use client";
import {
  addCategory as addCategoryAction,
  deleteCategory as deleteCategoryAction,
  getTaskCategories,
  updateCategory as updateCategoryAction,
} from "@/app/actions/userActions";
import type { ActionResult, TaskCategory } from "@/types/domain";
import { createContext, useCallback, useEffect, useState } from "react";
type CategoryContextType = {
  categories: TaskCategory[];
  addCategory: (category: TaskCategory) => Promise<ActionResult<TaskCategory>>;
  updateCategory: (
    category: TaskCategory,
  ) => Promise<ActionResult<TaskCategory>>;
  deleteCategory: (category: TaskCategory) => Promise<ActionResult<boolean>>;
  isPending: boolean;
};
const initValues: CategoryContextType = {
  categories: [],
  addCategory: async () => ({ status: "error", error: "" }),
  updateCategory: async () => ({ status: "error", error: "" }),
  deleteCategory: async () => ({ status: "error", error: "" }),
  isPending: false,
};
export const CategoryContext = createContext<CategoryContextType>(initValues);
export const CategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [isPending, setIsPending] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsPending(true);
    try {
      const response = await getTaskCategories();
      if (response.status === "success") setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsPending(false);
    }
  }, []);
  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);
  const addCategory = useCallback(
    async (category: TaskCategory): Promise<ActionResult<TaskCategory>> => {
      const response = await addCategoryAction(category);
      if (response.status === "success") {
        setCategories((current) => [...current, response.data]);
      }
      return response;
    },
    [],
  );
  const updateCategory = useCallback(
    async (category: TaskCategory): Promise<ActionResult<TaskCategory>> => {
      const response = await updateCategoryAction(category);
      if (response.status === "success") {
        setCategories((current) =>
          current.map((item) =>
            item.id === response.data.id ? response.data : item,
          ),
        );
      }
      return response;
    },
    [],
  );
  const deleteCategory = useCallback(
    async (category: TaskCategory): Promise<ActionResult<boolean>> => {
      const response = await deleteCategoryAction(category);
      if (response.status === "success" && category.id) {
        setCategories((current) =>
          current.filter((item) => item.id !== category.id),
        );
      }
      return response;
    },
    [],
  );
  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        isPending,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
