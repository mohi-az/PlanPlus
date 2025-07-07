import { fireEvent, render, screen } from "@testing-library/react"
import { CategoryContext } from '@/contexts/CategoryContext';
import TaskForm from '@/app/members/tasks/TaskForm'
import { mockUserTasks } from "../../mocks/mockData"
import { TasksContext } from '@/contexts/TasksContext'

const mockCategoryContext = {
    categories: [],
    addCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
    isPending: false
}
const mockContextValue = {
    tasks: [],
    filteredTasks: [],
    isPending: false,
    deleteTask: jest.fn(),
    addTask: jest.fn(),
    doneTask: jest.fn(),
    updateTask: jest.fn(),
    filterTasks: jest.fn(),
    filterTasksByCategory: jest.fn(),
    resetFilters: jest.fn(),
};
const renderedComponent = (showingModal: boolean, task: userTasks | null, ChangeFormVisibility = jest.fn()) => {
    return render(
        <CategoryContext.Provider value={mockCategoryContext}>
            <TasksContext.Provider value={mockContextValue}>
                <TaskForm showingModal={showingModal} task={task} ChangeFormVisibility={ChangeFormVisibility} />
            </TasksContext.Provider>
        </CategoryContext.Provider>)
}

describe("Test task form component", () => {

    it("should render the form when showingModal set to true", () => {
        renderedComponent(true, mockUserTasks[0]);
        expect(screen.getByTestId("taskForm")).toBeInTheDocument();
    })
    it("should not render the form when showingModal set to true", () => {
        renderedComponent(false, mockUserTasks[0]);
        expect(screen.queryByTestId("taskForm")).not.toBeInTheDocument();
    })
    it("should populate fields with task data", () => {
        renderedComponent(true, mockUserTasks[0]);
        expect(screen.getByDisplayValue(mockUserTasks[0].title)).toBeInTheDocument();
        if (mockUserTasks[0].description) {
            expect(screen.getByDisplayValue(mockUserTasks[0].description)).toBeInTheDocument();
        }
    });

    it("should call ChangeFormVisibility when Close button is clicked", () => {
        const mockChange = jest.fn();
        renderedComponent(true, mockUserTasks[0], mockChange)
        const closeBtn = screen.getByRole('button', { name: /close/i });
        closeBtn.click();
        expect(mockChange).toHaveBeenCalled();
    });

    it("should show validation errors if required fields are missing", async () => {
        renderedComponent(true, null);
        const submitBtn = screen.getByTestId("submitButton");
        fireEvent.click(submitBtn);
        expect(await screen.findByTestId("errorsSection")).toBeInTheDocument();
    });
})