import { render, screen, waitFor } from '@testing-library/react'
import UpcomingTask from '@/app/members/UpcomingTask'
import React from 'react'
import { TasksContext } from '@/contexts/TasksContext';
import { toast } from 'react-toastify';

import { GetUserTask } from '../../app/actions/userActions';

jest.mock('react-toastify', () => ({
    toast: { error: jest.fn() }
}));

jest.mock('../../app/actions/userActions', () => ({
    GetUserTask: jest.fn(() => Promise.resolve({
        status: 'success',
        data: [],
    })),
}));

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
const renderComponent = () => {
    return render(
        <TasksContext.Provider value={mockContextValue}>
            <UpcomingTask />
        </TasksContext.Provider>
    )
}
describe("Test upcomingTask Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render upcoming component", async () => {
        await waitFor(() => { renderComponent() })
    })
    it("Should render Empty Table", async () => {
        (GetUserTask as jest.Mock).mockResolvedValueOnce({
            status: 'success',
            data: [], // No tasks
        });
        renderComponent()
        expect(await screen.findByTestId('EmptyTask')).toBeInTheDocument();
        expect(await screen.findByText('No upcoming tasks—enjoy your day!')).toBeInTheDocument()
    })
    it("Should render upcoming tasks with mock data", async () => {
        (GetUserTask as jest.Mock).mockResolvedValueOnce({
            status: 'success',
            data: [
                {
                    id: '1',
                    title: 'Test Task',
                    description: 'Test Description',
                    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                    status: "Todo",
                    category: { id: "1", name: "General" },
                    createdAt: new Date(),
                    userId: '123',
                    reminder: null,
                },
            ],
        });
        renderComponent()
        expect(await screen.findByTestId('UpcommingTasksTable')).toBeInTheDocument();
        expect(await screen.findByText("Test Task")).toBeInTheDocument();
        expect(await screen.findByText("Test Description")).toBeInTheDocument();
    });
    it("Should Show loading when pending flag set to true",  () => {
        render(
            <TasksContext.Provider value={{ ...mockContextValue, isPending: true }}>
                <UpcomingTask />
            </TasksContext.Provider>
        )
        expect( screen.getByTestId('LoadingComponent')).toBeInTheDocument();
    }
    )
    it("Should show an error if GetUserTask returns an error", async () => {

        (GetUserTask as jest.Mock).mockResolvedValueOnce({
            status: 'success',
            data: []
        });
        renderComponent()
        waitFor(() =>
            expect(toast.error).toHaveBeenCalledWith('Something went wrong!')
        )
    })

})