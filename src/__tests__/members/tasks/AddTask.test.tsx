import { render, screen, fireEvent } from '@testing-library/react'
import AddNewTask from '../../../app/members/tasks/AddTask'

const renderComponent = () => {
    return render(<AddNewTask />)
}
jest.mock('../../../app/members/tasks/TaskForm', () =>
    function TaskForm(props: { showingModal: string }) {
        return <div data-testid="TaskForm" data-showingModal={props.showingModal ? "true" : "false"} />
    })
describe("test AddTask Component", () => {

    it("Should render component", () => {
        renderComponent();
    })
    it("Should load elements component", () => {
        renderComponent();
        expect(screen.getByTestId("TaskForm")).toBeInTheDocument();
        expect(screen.getByTestId("AddTaskButton")).toBeInTheDocument();

    })
    it("Should toggle showingModal prop in TaskForm after button click", () => {
        renderComponent();
        const button = screen.getByTestId("AddTaskButton");
        expect(screen.getByTestId("TaskForm")).toHaveAttribute('data-showingmodal', 'false');

        fireEvent.click(button);
        expect(screen.getByTestId("TaskForm")).toHaveAttribute('data-showingmodal', 'true');
    });
})