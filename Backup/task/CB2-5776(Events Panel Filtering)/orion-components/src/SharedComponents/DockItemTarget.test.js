import React from "react";
import DockItemTarget from "./DockItemTarget";

import { shallow } from "enzyme";

describe("DockItemTarget", () => {
	it("renders", () => {
		const wrapper = shallow(<DockItemTarget />);
		expect(wrapper).toMatchSnapshot();
	});
});
