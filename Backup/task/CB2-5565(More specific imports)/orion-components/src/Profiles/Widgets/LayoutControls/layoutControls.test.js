import React from "react";
import LayoutControls from "./LayoutControls";

import { shallow } from "enzyme";

describe("LayoutControls", () => {
	it("renders", () => {
		const wrapper = shallow(<LayoutControls open={true} close={() => {}} />);
		expect(wrapper).toMatchSnapshot();
	});
});
