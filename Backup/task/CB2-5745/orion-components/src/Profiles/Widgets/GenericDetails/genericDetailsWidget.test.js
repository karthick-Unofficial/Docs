import React from "react";
import GenericDetailsWidget from "./GenericDetailsWidget";

import { shallow } from "enzyme";

jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
	Map: () => ({})
}));

describe("DetailsWidget", () => {
	it("renders", () => {
		const kvPairs = [
			{
				key: "test key",
				value: "test value"
			}
		];

		const wrapper = shallow(<GenericDetailsWidget kvPairs={kvPairs} />);
		expect(wrapper).toMatchSnapshot();
	});
	it("renders with display props", () => {
		const kvPairs = [
			{
				key: "test key",
				value: "test value"
			}
		];

		const displayProps = {
			"test key": "change key"
		};

		const wrapper = shallow(
			<GenericDetailsWidget
				kvPairs={kvPairs}
				displayProps={displayProps}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
