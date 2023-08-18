import React from "react";
import EntityAddToCollection from "./EntityAddToCollection";

import { shallow } from "enzyme";

const sampleCollections = [
	{
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
		sharedWith: { ares_security_corporation: "VIEW/EDIT" }
	},
	{
		createdDate: 1508948833.993,
		entities: [
			"aishub.367599850",
			"924a3902-32b1-4515-bb06-48b07abc7308",
			"aishub.305442000",
			"28e8fb23-62f9-45fe-8cc1-1cf08019b370"
		],
		id: "0d731b60-d1a2-4354-bc45-1a7abaa09027",
		isDeleted: false,
		lastModifiedDate: 1508948833.993,
		name: "123",
		owner: "ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
		ownerOrg: "ares_security_corporation"
	}
];

describe("EntityAddToCollection", () => {
	it("renders", () => {
		const wrapper = shallow(
			<EntityAddToCollection
				userCanEditEntities={true}
				entityCollections={sampleCollections}
			/>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
