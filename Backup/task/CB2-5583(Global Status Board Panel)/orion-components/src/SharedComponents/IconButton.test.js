import React from "react";
import IconButton from "./IconButton";

import { shallow } from "enzyme";

describe("IconButton", () => {
	it("renders", () => {

		const wrapper = shallow(
			<IconButton 
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
