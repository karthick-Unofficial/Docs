import React from "react";
import PhoenixDropzone from "./PhoenixDropzone";

import { shallow } from "enzyme";

describe("PhoenixDropzone", () => {
	it("renders", () => {

		const wrapper = shallow(
			<PhoenixDropzone 
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
