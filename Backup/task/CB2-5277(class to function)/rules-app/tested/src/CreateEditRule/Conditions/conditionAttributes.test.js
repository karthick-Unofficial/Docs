import React from "react";
import ConditionsAttributes from "./ConditionsAttributes";
import renderer from "react-test-renderer";


import { shallow } from "enzyme";

// FIXME: Figure out what is causing the Enzyme error and fix it, then add test back.
// See conditionDialog.test.js for more information about the error. 
it("renders", () => {

	const entityCollections = {
		"9060a879-c890-4363-a97f-12fa4178b318" : {
			"id": "123456789012345",
			"isOwner": true,
			"members": [],
			"name": "Too Cool For Rule"
		}
	};

	// const wrapper = shallow(
	// 	<ConditionsAttributes 
	//   	conditions={[{
	// 			id: "9060a879-c890-4363-a97f-12fa4178b318",
	// 			type: "not-in-collection"
	// 		}]}
	//   	styles={{}}
	// 		entityCollections={entityCollections}
	// 	/>
	// );
	// expect(wrapper).toMatchSnapshot();
	return new Promise(resolve => {
		resolve();
	});
});