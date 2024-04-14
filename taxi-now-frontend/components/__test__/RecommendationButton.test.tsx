import {render, screen, userEvent} from '@testing-library/react-native';
import { GetRecommendationButton } from '../RecommendationButton';
import axios from 'axios';

jest.useFakeTimers();

test('recommnedation button get a list of buttons', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
        data: [
        [0, 1],
        [2, 3],
        [3, 5]
    ]});

    const checkErr = jest.fn();
    const setLocations = jest.fn();
    const currentLocation = {
        latitude: 0,
        longitude: 0
    };

    const user = userEvent.setup();

    render(<GetRecommendationButton checkErr={checkErr} currentLocation={currentLocation} setLocations={setLocations} />);

    const button = screen.getByTestId("recommendation-button");

    await user.press(button);

    expect(checkErr).toHaveBeenCalledTimes(0);
    expect(setLocations).toHaveBeenCalledWith([
        {latitude: 0, longitude: 1},
        {latitude: 2, longitude: 3},
        {latitude: 3, longitude: 5},
    ]);
})