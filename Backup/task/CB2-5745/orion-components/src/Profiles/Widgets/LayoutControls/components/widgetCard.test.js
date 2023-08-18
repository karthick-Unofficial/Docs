import React from "react";
import WidgetCard from "./WidgetCard";
import * as reactRedux from "react-redux";
import { shallow } from "enzyme";
import { i18n } from "orion-components/testData/i18n";

jest.mock("react-redux", () => ({
	useSelector: jest.fn(),
	useDispatch: jest.fn()
}));

describe("WidgetCard", () => {
	beforeEach(() => {
		useDispatchMock.mockImplementation(() => () => {});
		useSelectorMock.mockImplementation((selector) => selector(mockStore));
	});
	afterEach(() => {
		useDispatchMock.mockClear();
		useSelectorMock.mockClear();
	});

	const useSelectorMock = reactRedux.useSelector;
	const useDispatchMock = reactRedux.useDispatch;

	const mockStore = {
		i18n
	};
	const widget = {
		name: "Alerts",
		id: "alerts",
		enabled: true
	};

	it("renders", () => {
		const wrapper = shallow(
			<WidgetCard widget={widget} enable={() => {}} disable={() => {}} />
		);
		expect(wrapper).toMatchSnapshot();
	});
});
