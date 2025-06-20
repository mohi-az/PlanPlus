import { render, screen } from "@testing-library/react"
import Stat from '../../../lib/components/Stat'
const MockData: { icon?: any, title: string, value: string, desc: string } = {
    desc: "All tasks in your list",
    title: "Total Tasks",
    value: "23",
}

jest.mock('lottie-web')
jest.mock('../../../lib/components/Lottie', () => function Lottie() {
    return <div data-testid="Icon" />
});

describe("Test Stat Component", () => {

    it("Should render Stat component", () => {

         render(<Stat {...MockData} />)
    })
    it("Should load a icon",  () => {
        render(<Stat {...MockData} icon={"IconName"} />)
        expect( screen.getByTestId("Icon")).toBeInTheDocument();
    })
    it("Should not render icon if icon prop is undefined", () => {
        render(<Stat {...MockData} />);
        expect(screen.queryByTestId("Icon")).not.toBeInTheDocument();
    });

})