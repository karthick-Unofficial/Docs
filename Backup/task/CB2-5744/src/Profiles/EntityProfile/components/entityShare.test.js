import React from "react";
import EntityShare from "./EntityShare";

import { shallow } from "enzyme";

describe("EntityShare", () => {
	it("renders", () => {
		const wrapper = shallow(<EntityShare />);
		expect(wrapper).toMatchSnapshot();
	});
});
