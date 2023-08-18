import React from "react";
import EntityEdit from "./EntityEdit";

import { shallow } from "enzyme";

describe("EntityEdit", () => {
	it("renders", () => {

		const wrapper = shallow(
			<EntityEdit 
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
