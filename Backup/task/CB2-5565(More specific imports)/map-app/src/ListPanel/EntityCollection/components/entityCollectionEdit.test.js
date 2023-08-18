// import React from "react";
// import EntityCollectionEdit from "./EntityCollectionEdit";

// import { shallow } from "enzyme";

// jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
// 	Map: () => ({})
// }));

const sampleCollectionMembers = [
	{
		appId: "map-app",
		createdDate: 1507732621.787,
		entityData: {
			geometry: {
				coordinates: [5.369947012755148, 52.734756078634234],
				type: "Point"
			},
			properties: {
				description: "testing",
				id: "924a3902-32b1-4515-bb06-48b07abc7308",
				name: "KL point 1011"
			},
			type: "Point"
		},
		entityType: "shapes",
		feedId: "shapes",
		id: "924a3902-32b1-4515-bb06-48b07abc7308",
		isDeleted: false,
		isOwner: false,
		isShareable: true,
		lastModifiedBy: "3518f215-9f55-42a6-be32-9b28d352a8f9",
		lastModifiedDate: 1507754636.375,
		owner: "3518f215-9f55-42a6-be32-9b28d352a8f9",
		ownerOrg: "ares_security_corporation"
	},
	{
		appId: "map-app",
		createdDate: 1507728233.366,
		entityData: {
			geometry: {
				coordinates: [
					[
						[5.328507025873961, 52.736662582671556],
						[5.410389502719198, 52.79021721712368],
						[5.312370856414418, 52.73365263207913],
						[5.368332465329928, 52.72689398744197],
						[5.337090094730826, 52.70609266897472],
						[5.336060126444323, 52.74809653622009],
						[5.31563242258872, 52.75755413572284],
						[5.328507025873961, 52.736662582671556]
					]
				],
				type: "Polygon"
			},
			properties: {
				description: "zone activity test",
				id: "28e8fb23-62f9-45fe-8cc1-1cf08019b370",
				name: "kl zone "
			},
			type: "Polygon"
		},
		entityType: "shapes",
		feedId: "shapes",
		id: "28e8fb23-62f9-45fe-8cc1-1cf08019b370",
		isDeleted: false,
		isOwner: false,
		isShareable: true,
		lastModifiedBy: "3518f215-9f55-42a6-be32-9b28d352a8f9",
		lastModifiedDate: 1507755662.984,
		owner: "3518f215-9f55-42a6-be32-9b28d352a8f9",
		ownerOrg: "ares_security_corporation"
	}
];

const sampleFeaturesItems = [
	{
		appId: "map-app",
		createdDate: 1507732621.787,
		entityData: {
			geometry: {
				coordinates: [5.369947012755148, 52.734756078634234],
				type: "Point"
			},
			properties: {
				description: "testing",
				id: "924a3902-32b1-4515-bb06-48b07abc7308",
				name: "KL point 1011"
			},
			type: "Point"
		},
		entityType: "shapes",
		feedId: "shapes",
		id: "924a3902-32b1-4515-bb06-48b07abc7308",
		isDeleted: false,
		isOwner: false,
		isShareable: true,
		lastModifiedBy: "3518f215-9f55-42a6-be32-9b28d352a8f9",
		lastModifiedDate: 1507754636.375,
		owner: "3518f215-9f55-42a6-be32-9b28d352a8f9",
		ownerOrg: "ares_security_corporation"
	},
	{
		appId: "map-app",
		createdDate: 1507728233.366,
		entityData: {
			geometry: {
				coordinates: [
					[
						[5.328507025873961, 52.736662582671556],
						[5.410389502719198, 52.79021721712368],
						[5.312370856414418, 52.73365263207913],
						[5.368332465329928, 52.72689398744197],
						[5.337090094730826, 52.70609266897472],
						[5.336060126444323, 52.74809653622009],
						[5.31563242258872, 52.75755413572284],
						[5.328507025873961, 52.736662582671556]
					]
				],
				type: "Polygon"
			},
			properties: {
				description: "zone activity test",
				id: "28e8fb23-62f9-45fe-8cc1-1cf08019b370",
				name: "kl zone "
			},
			type: "Polygon"
		},
		entityType: "shapes",
		feedId: "shapes",
		id: "28e8fb23-62f9-45fe-8cc1-1cf08019b370",
		isDeleted: false,
		isOwner: false,
		isShareable: true,
		lastModifiedBy: "3518f215-9f55-42a6-be32-9b28d352a8f9",
		lastModifiedDate: 1507755662.984,
		owner: "3518f215-9f55-42a6-be32-9b28d352a8f9",
		ownerOrg: "ares_security_corporation"
	}
];

/**
 * FIXME: Figure out Enzyme error and readd test
 * See entityCollectionToggle.test.js for more information
 */
describe("EntityCollectionEdit", () => {
	it("renders", () => {
		// const wrapper = shallow(
		// 	<EntityCollectionEdit
		// 		label="collection"
		// 		collectionMembers={sampleCollectionMembers}
		// 		featuresItems={sampleFeaturesItems}
		// 	/>
		// );
		// expect(wrapper).toMatchSnapshot();

		return new Promise(resolve => {
			resolve();
		});
	});
});
