import UpcomingTask from "@/app/members/UpcomingTask";
import { TasksContext } from "@/contexts/TasksContext";
import type { UserTask } from "@/types/domain";
import { render, screen } from "@testing-library/react";

const baseContext = {
  tasks: [] as UserTask[],
  filteredTasks: null,
  isPending: false,
  deleteTask: jest.fn(),
  addTask: jest.fn(),
  doneTask: jest.fn(),
  updateTask: jest.fn(),
  filterTasks: jest.fn(),
  filterTasksByCategory: jest.fn(),
  resetFilters: jest.fn(),
};

const renderComponent = (tasks: UserTask[] = [], isPending = false) =>
  render(
    <TasksContext.Provider value={{ ...baseContext, tasks, isPending }}>
      <UpcomingTask />
    </TasksContext.Provider>,
  );

describe("UpcomingTask", () => {
  it("renders the empty state when there are no upcoming tasks", () => {
    renderComponent();
    expect(screen.getByTestId("EmptyTask")).toHaveTextContent(
      "No upcoming tasks—enjoy your day!",
    );
  });

  it("renders tasks due within the next five days", () => {
    renderComponent([
      {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "Todo",
        category: { id: "1", name: "General" },
        createdAt: new Date(),
        userId: "123",
        reminder: null,
      },
    ]);

    expect(screen.getByTestId("UpcomingTasksTable")).toBeInTheDocument();
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("shows loading state while tasks are being fetched", () => {
    renderComponent([], true);
    expect(screen.getByTestId("LoadingComponent")).toBeInTheDocument();
  });
});
