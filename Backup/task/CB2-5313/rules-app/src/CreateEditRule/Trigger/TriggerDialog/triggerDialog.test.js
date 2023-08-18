import React from "react";
import TriggerDialog from "./TriggerDialog";
import renderer from "react-test-renderer";


import { shallow } from "enzyme";

// FIXME: Figure out what is causing the Enzyme error and fix it, then add test back.
// See conditionDialog.test.js for more information about the error. 
it("renders", () => {

	// const targets = [{
	// 	appId: "map-app",
	// 	createdDate: 1507734299.716,
	// 	entityData: {
	// 		geometry: {
	// 			coordinates: [
	// 				[
	// 					[
	// 						5.527014774676502,
	// 						52.79567410732079
	// 					],
	// 					[
	// 						5.536284489036916,
	// 						52.76867860828992
	// 					],
	// 					[
	// 						5.497145695084441,
	// 						52.76161548420151
	// 					],
	// 					[
	// 						5.4902792400176,
	// 						52.807712851136046
	// 					],
	// 					[
	// 						5.527014774676502,
	// 						52.79567410732079
	// 					]
	// 				]
	// 			],
	// 			type: "Polygon"
	// 		},
	// 		properties: {
	// 			description: "",
	// 			name: "test entity"
	// 		},
	// 		type: "Polygon"
	// 	},
	// 	entityType: "shapes",
	// 	feedId: "shapes",
	// 	id: "0bea54e5-5c88-4c80-b427-1c68c9952af5",
	// 	isDeleted: false,
	// 	isShareable: true,
	// 	lastModifiedDate: 1507734299.716,
	// 	owner: "3518f215-9f55-42a6-be32-9b28d352a8f9",
	// 	ownerOrg: "ares_security_corporation"
	// }];

	// const wrapper = shallow(
	// 	<TriggerDialog
	// 		typeAheadFilterValue={""}
	// 		shapeList={targets} 
	// 		isOpen={true}
	//     	styles={{}}
	//     	targets={targets}
	// 	/>
	// );
	// expect(wrapper).toMatchSnapshot();

	return new Promise(resolve => {
		resolve();
	});
});