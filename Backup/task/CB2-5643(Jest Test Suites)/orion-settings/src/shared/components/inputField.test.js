import React from "react";
import InputField from "./InputField";

import { shallow } from "enzyme";

describe("InputField", () => {
	it("renders", () => {
		const wrapper = shallow(
			<InputField />
		);
		expect(wrapper).toMatchSnapshot();
	});
});