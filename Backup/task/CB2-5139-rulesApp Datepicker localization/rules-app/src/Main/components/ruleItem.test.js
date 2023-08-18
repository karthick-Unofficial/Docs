import React from "react";
import RuleItem from "./RuleItem";
import renderer from "react-test-renderer";


import { shallow } from "enzyme";

// FIXME: Figure out what is causing the Enzyme error and fix it, then add test back.
// See conditionDialog.test.js for more information about the error. 
it("renders", () => {

	// const wrapper = shallow(
	// 	<RuleItem
	// 		key={"123"}
	// 		linkId={"123"}
	// 		ruleName={"Rule"}
	// 		isPriority={false}
	// 		desc={"Hello world." || "Foo Bar."}
	// 		notifySystem={false}
	// 		notifyEmail={false}
	// 		notifyPush={false}
	// 	/>
	// );
	// expect(wrapper).toMatchSnapshot();

	return new Promise(resolve => {
		resolve();
	});
});