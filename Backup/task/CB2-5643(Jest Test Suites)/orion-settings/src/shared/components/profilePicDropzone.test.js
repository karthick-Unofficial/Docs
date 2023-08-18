import React from "react";
import ProfilePicDropzone from "./ProfilePicDropzone";

import { shallow } from "enzyme";

describe("ProfilePicDropzone", () => {
	it("renders", () => {

		const wrapper = shallow(
			<ProfilePicDropzone label="" stageFile={() => { }} />
		);
		expect(wrapper).toMatchSnapshot();
	});
});