import { TasksContext } from "@/contexts/TasksContext";
import TaskList from "@/app/members/tasks/TasksList";
import { fireEvent, render, screen } from "@testing-library/react";
import { mockUserTasks } from "../../mocks/mockData";
import type { UserTask } from "@/types/domain";

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
const renderedComponent = (userTask: UserTask[] = [], filteredTasks = null) => {
  return render(
    <TasksContext.Provider value={mockContextValue}>
      <TaskList
        key={"test"}
        filteredTasks={filteredTasks}
        userTask={userTask}
      />
    </TasksContext.Provider>,
  );
};
jest.mock(
  "@/app/members/tasks/CompleteTask",
  () =>
    function CompleteTaskDialog(props: { visible: boolean }) {
      return (
        <div
          data-testid="CompleteTaskDialog"
          data-visible={props.visible ? true : false}
        />
      );
    },
);

jest.mock(
  "@/app/members/tasks/TaskForm",
  () =>
    function EditTaskForm(props: { showingModal: boolean }) {
      return (
        <div
          data-testid="EditTaskForm"
          data-showingmodal={props.showingModal ? true : false}
        />
      );
    },
);
jest.mock("@/lib/components/Dialog", () => ({
  Dialog: (props: { Visibility: boolean }) => (
    <div data-testid="deleteDialog" data-visibility={props.Visibility} />
  ),
}));

describe("Test task list component", () => {
  it("should show the table when tasksList is not empty", () => {
    renderedComponent(mockUserTasks, null);
    expect(screen.getByTestId("taskListTable")).toBeInTheDocument();
  });
  it("should show 'There are no tasks to display.' when tasksList is empty", () => {
    renderedComponent([], null);
    expect(
      screen.getByText("There are no tasks to display."),
    ).toBeInTheDocument();
  });
  it("should show dialog after button click", () => {
    renderedComponent(mockUserTasks, null);

    const Donebtn = screen.getAllByTestId("Donebtn")[0];
    expect(screen.queryByTestId("CompleteTaskDialog")).not.toBeInTheDocument();

    fireEvent.click(Donebtn);
    expect(screen.getByTestId("CompleteTaskDialog")).toHaveAttribute(
      "data-visible",
      "true",
    );
  });
  it("Should render a dialog for edit a task after 'View/Edit' button", () => {
    renderedComponent(mockUserTasks, null);

    const editTaskbtn = screen.getAllByTestId("editTaskbtn")[0];
    expect(screen.getByTestId("EditTaskForm")).toHaveAttribute(
      "data-showingmodal",
      "false",
    );

    fireEvent.click(editTaskbtn);
    expect(screen.getByTestId("EditTaskForm")).toHaveAttribute(
      "data-showingmodal",
      "true",
    );
  });
  it("should show the delete dialog when delete button is clicked", () => {
    renderedComponent(mockUserTasks, null);
    const deleteButton = screen.getAllByTestId("deleteTask")[0];

    expect(screen.getByTestId("deleteDialog")).toHaveAttribute(
      "data-visibility",
      "false",
    );

    fireEvent.click(deleteButton);
    expect(screen.getByTestId("deleteDialog")).toHaveAttribute(
      "data-visibility",
      "true",
    );
  });
  it("should open edit modal when task title is clicked", () => {
    renderedComponent(mockUserTasks, null);
    const titleDiv = screen.getByText(mockUserTasks[0].title);
    fireEvent.click(titleDiv);
    expect(screen.getByTestId("EditTaskForm")).toHaveAttribute(
      "data-showingmodal",
      "true",
    );
  });
});
