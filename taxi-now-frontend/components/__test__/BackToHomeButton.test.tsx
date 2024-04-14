import { render, screen, userEvent } from "@testing-library/react-native"
import { BackToHomeButton } from "../BackToHomeButton"

jest.useFakeTimers();

test('Home Button should move the map', async () => {
    const moveMap = jest.fn(); // This function will move the map based on the desired location.
    const user = userEvent.setup();
    render(<BackToHomeButton moveMap={moveMap} />);

    const button = screen.getByTestId('home-button');
    await user.press(button);

    expect(moveMap).toHaveBeenCalledTimes(1);
})