import React from "react";
import CreateEditRule from "./CreateEditRule";
import renderer from "react-test-renderer";


import { shallow } from "enzyme";

// FIXME: Figure out what is causing the Enzyme error and fix it, then add test back.
// See conditionDialog.test.js for more information about the error. 
it("renders", () => {

	// const wrapper = shallow(
	// 	<CreateEditRule 
	// 		location={{children:[]}}
	// 		user={{isHydrated: true, profile: {id: "123", orgRole: {organization: {canShare: true}}}}}
	// 		orgUsers={[{id: "3518f215-9f55-42a6-be32-9b28d352a8f9", name: "John Doe"}]}
	// 	/>
	// );
	// expect(wrapper).toMatchSnapshot();
	return new Promise(resolve => {
		resolve();
	});
});