import { TasksContext } from '@/contexts/TasksContext'
import TaskList from '@/app/members/tasks/TasksList'
import { fireEvent, render, screen } from '@testing-library/react'
import { mockUserTasks } from "../../mocks/mockData"

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
const renderedComponent = (userTask: userTasks[] = [], filteredTasks = null) => {
    return render(
        <TasksContext.Provider value={mockContextValue}>
            <TaskList key={"test"} filteredTasks={filteredTasks} userTask={userTask} />
        </TasksContext.Provider>
    )
}
jest.mock('@/app/members/tasks/CompleteTask', () =>
    function CompleteTaskDialog(props: { visible: boolean }) {
        return (<div data-testid="CompleteTaskDialog" data-visible={props.visible ? true : false} />)
    })

jest.mock('@/app/members/tasks/TaskForm', () =>
    function EditTaskForm(props: { showingModal: boolean }) {
        return (<div data-testid='EditTaskForm'
            data-showingModal={props.showingModal ? true : false} />)
    }
)
jest.mock('@/lib/components/Dialog', () => ({
    Dialog: (props: any) => (<div data-testid="deleteDialog" data-Visibility={props.Visibility ? true : false} />)
}))

describe("Test task list component", () => {

    it("should show the table when tasksList is not empty", () => {
        renderedComponent(mockUserTasks, null)
        expect(screen.getByTestId("taskListTable")).toBeInTheDocument();
    }
    )
    it("should show 'There are no tasks to display.' when tasksList is empty", () => {
        renderedComponent([], null)
        expect(screen.getByText("There are no tasks to display.")).toBeInTheDocument();
    })
    it("should show dialog after button click", () => {
        renderedComponent(mockUserTasks, null)

        const Donebtn = screen.getAllByTestId("Donebtn")[0];
        expect(screen.getByTestId("CompleteTaskDialog")).toHaveAttribute('data-visible', 'false');

        fireEvent.click(Donebtn);
        expect(screen.getByTestId("CompleteTaskDialog")).toHaveAttribute('data-visible', 'true');
    })
    it("Should render a dialog for edit a task after 'View/Edit' button", () => {
        renderedComponent(mockUserTasks, null)

        const editTaskbtn = screen.getAllByTestId("editTaskbtn")[0];
        expect(screen.getByTestId("EditTaskForm")).toHaveAttribute('data-showingModal', 'false')

        fireEvent.click(editTaskbtn);
        expect(screen.getByTestId("EditTaskForm")).toHaveAttribute('data-showingModal', 'true')
    })
    it("should show the delete dialog when delete button is clicked", () => {
        renderedComponent(mockUserTasks, null);
        const deleteButton = screen.getAllByTestId("deleteTask")[0]

        expect(screen.getByTestId("deleteDialog")).toHaveAttribute("data-Visibility", "false")

        fireEvent.click(deleteButton);
        expect(screen.getByTestId("deleteDialog")).toHaveAttribute("data-Visibility", "true")

    })
    it("should open edit modal when task title is clicked", () => {
        renderedComponent(mockUserTasks, null);
        const titleDiv = screen.getByText(mockUserTasks[0].title);
        fireEvent.click(titleDiv);
        expect(screen.getByTestId("EditTaskForm")).toHaveAttribute('data-showingModal', 'true');
    });
})
