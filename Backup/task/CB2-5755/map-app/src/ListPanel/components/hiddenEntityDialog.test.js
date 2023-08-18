import React from "react";
import HiddenEntityDialog from "./HiddenEntityDialog";

import { shallow } from "enzyme";

jest.mock("mapbox-gl", () => {});

jest.mock("react-redux", () => ({
	useSelector: jest.fn().mockImplementation((selector) => selector()),
	useDispatch: () => jest.fn()
}));

const sampleExclusions = [
	{
		created: "2023-01-09T10:06:50.506Z",
		entityId: "b2627cc9-f798-11ea-99c0-db8fe46b59a2",
		entityType: "camera",
		feedId: "aiv-cameras",
		iconType: "Camera",
		id: "e4a946cf-c752-4090-a74d-e163ee1b7f8f",
		name: "Dyess AFB - 4th and Avenue B",
		userId: "ed3d2e80-9737-40cd-ad06-74dc8c6e2003"
	}
];

/**
 * FIXME: Figure out Enzyme error and readd test
 * See entityCollectionToggle.test.js for more information
 */
describe("HiddenEntityDialog", () => {
	it("renders correctly when open", () => {
		const wrapper = shallow(
			<HiddenEntityDialog open={true} exclusions={[]} />
		);
		expect(wrapper).toMatchSnapshot();
	});

	it("renders correctly when closed", () => {
		const wrapper = shallow(
			<HiddenEntityDialog open={false} exclusions={[]} />
		);
		expect(wrapper).toMatchSnapshot();
	});

	it("renders", () => {
		const wrapper = shallow(
			<HiddenEntityDialog exclusions={sampleExclusions} />
		);
		expect(wrapper).toMatchSnapshot();
	});
});
