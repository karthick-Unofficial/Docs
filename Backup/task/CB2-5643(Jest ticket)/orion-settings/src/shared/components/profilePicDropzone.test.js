import React from "react";
import ProfilePicDropzone from "./ProfilePicDropzone";

import { shallow } from "enzyme";

describe("requestReset", () => {
	it("renders", () => {

		const wrapper = shallow(
			<ProfilePicDropzone label="" stageFile={() => { }} />
		);
		expect(wrapper).toMatchSnapshot();
	});
});