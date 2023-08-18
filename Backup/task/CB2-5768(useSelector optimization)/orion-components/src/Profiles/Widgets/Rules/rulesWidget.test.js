import React from "react";
import RulesWidget from "./RulesWidget";

import { shallow } from "enzyme";

import { userData } from "orion-components/testData";

describe("RulesWidget", () => {
	it("renders", () => {
		const wrapper = shallow(<RulesWidget rules={[]} user={userData} />);
		expect(wrapper).toMatchSnapshot();
	});
});
