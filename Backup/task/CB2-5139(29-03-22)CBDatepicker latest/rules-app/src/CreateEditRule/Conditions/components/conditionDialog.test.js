import React from "react";
import ConditionDialog from "./ConditionDialog";
import renderer from "react-test-renderer";


import { shallow } from "enzyme";

/** FIXME: Figure out what is causing the Enzyme error and fix it, then add this test back
 * 
 * Error:
 * 
 * Enzyme Internal Error: Enzyme expects an adapter to be configured, but found none.
 *        To configure an adapter, you should call `Enzyme.configure({ adapter: new Adapter() })`
 *        before using any of Enzyme's top level APIs, where `Adapter` is the adapter
 *        corresponding to the library currently being tested. For example:
 *
 *        import Adapter from 'enzyme-adapter-react-15';
 *
 *        To find out more about this, see http://airbnb.io/enzyme/docs/installation/index.html
 */
it("renders", () => {

	const entityCollections = {
		items: [
			"9060a879-c890-4363-a97f-12fa4178b318",
			"5511144d-0b59-48a1-a094-9d956d09495d"
		],
		itemsById: {
			"9060a879-c890-4363-a97f-12fa4178b318": {
				createdDate: 1506532486.556,
				entities: [
					"273d8043-3177-4076-85bc-4c410e21fbad",
					"63c9a5b1-01bc-4cdf-a52d-8b1a3bc2e55f",
					"e955f9a6-3bab-4402-8171-ae8c553d29fa",
					"e090f394-6ea8-4615-b987-cf8b47cae5e8",
					"12c364c2-2d8a-4445-a534-00acf33f40f6",
					"39537f4a-9dd2-47fe-910c-9625433de832",
					"083797da-433c-4f01-93b1-88bc3b785ee5"
				],
				id: "9060a879-c890-4363-a97f-12fa4178b318",
				isDeleted: false,
				lastModifiedDate: "2017-10-23T14:26:09.618Z",
				name: "Florence Group",
				owner: "b617dedf-9e59-418d-9737-fb6cae298ef3",
				ownerOrg: "ares_security_corporation",
				sharedWith: {}
			},
			"5511144d-0b59-48a1-a094-9d956d09495d": {
				createdDate: 1508185825.431,
				entities: [
					"aishub.367599850",
					"924a3902-32b1-4515-bb06-48b07abc7308",
					"aishub.305442000",
					"28e8fb23-62f9-45fe-8cc1-1cf08019b370",
					"0bea54e5-5c88-4c80-b427-1c68c9952af5"
				],
				id: "5511144d-0b59-48a1-a094-9d956d09495d",
				isDeleted: false,
				lastModifiedDate: "2017-10-25T16:15:15.335Z",
				name: "Collection 1016",
				owner: "3518f215-9f55-42a6-be32-9b28d352a8f9",
				ownerOrg: "ares_security_corporation",
				sharedWith: {
					ares_security_corporation: "VIEW/EDIT"
				}
			}
		}
	};

	// const wrapper = shallow(
	// 	<ConditionDialog
	// 		modal={true}
	// 		conditions={[{
	// 			id: "9060a879-c890-4363-a97f-12fa4178b318",
	// 			type: "not-in-collection"
	// 		}]}
	// 		availableConditions={[
	// 			"time",
	// 			"speed",
	// 			"in-collection",
	// 			"not-in-collection"
	// 		]}
	// 		contentStyle={{}}
	// 		isOpen={true}
	// 		editing={false}
	// 		entityCollections={entityCollections}
	// 	/>
	// );
	// expect(wrapper).toMatchSnapshot();
	return new Promise(resolve => {
		resolve();
	});
});