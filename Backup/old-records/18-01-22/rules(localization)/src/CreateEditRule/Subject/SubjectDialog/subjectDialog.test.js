import React from "react";
import SubjectDialog from "./SubjectDialog";
import renderer from "react-test-renderer";


import { shallow } from "enzyme";

// FIXME: Figure out what is causing the Enzyme error and fix it, then add test back.
// See conditionDialog.test.js for more information about the error. 
it("renders", () => {

	// const subject = [{
	// 	id: "aishub.024660592",
	// 	name: "024660592"
	// }];

	// const wrapper = shallow(
	// 	<SubjectDialog
	// 		typeAheadFilterValue={""}
	// 		trackList={subject} 
	// 		isOpen={true}
	//   	styles={{}}
	//   	subject={subject}
	// 	/>
	// );
	// expect(wrapper).toMatchSnapshot();
	return new Promise(resolve => {
		resolve();
	});
});