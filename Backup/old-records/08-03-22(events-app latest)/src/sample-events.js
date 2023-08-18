export const events = [
	{
		id: "94c8f110-e742-4f02-90b4-4df478bf5e8b",
		name: "Carnival Glory",
		type: "Planned",
		description: "This is a sample event. It is a planned event.",
		startDate: 1518627600000,
		endDate: 1519809300000,
		owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		ownerOrg: "ares_security_corporation",
		isPublic: true,
		sharedWith: ["another_org"],
		comments: ["23498d09-ce01-45d5-81b2-9b49fa3e47ac"],
		lists: ["02ffc89d-c8c8c8-fdsfes-9237592"],
		pinnedItems: ["aishub.245854000", "2ae4acb2-32f4-4901-9420-0c5659cf080c"]
	},
	{
		id: "94c8f110-e742-4f02-90b4-4df478bf5e8c",
		name: "North Gate Security Incident",
		type: "Emergent",
		startDate: 1518682500000,
		endDate: 1519809300000,
		owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		ownerOrg: "ares_security_corporation",
		isPublic: true,
		sharedWith: [],
		comments: [],
		lists: [],
		pinnedItems: []
	},
	{
		id: "94c8f110-e742-4f02-90b4-4df478bf5e8d",
		name: "Dock Zone Breach",
		type: "Emergent",
		startDate: 1518682500000,
		endDate: 1519809300000,
		owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		ownerOrg: "ares_security_corporation",
		isPublic: true,
		sharedWith: [],
		comments: [
			{
				text: "This is another fake comment on another fake event.",
				timestamp: 1518800400000,
				ownerId: "2c9c0362-345b-4f33-9976-219a4566b9c3",
				ownerName: "Org Admin"
			}
		],
		lists: [],
		pinnedItems: []
	},
	{
		id: "94c8f110-e742-4f02-90b4-4df478bf5e8e",
		name: "Forced Entry",
		type: "Emergent",
		startDate: 1518682500000,
		endDate: 1519809300000,
		owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		ownerOrg: "ares_security_corporation",
		isPublic: true,
		sharedWith: [],
		comments: [],
		lists: [],
		pinnedItems: []
	},
	{
		id: "94c8f110-e742-4f02-96b4-4df478bf5e8e",
		name: "Closed Event",
		type: "Emergent",
		startDate: 1518627600000,
		endDate: 1518682500000,
		owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		ownerOrg: "ares_security_corporation",
		isPublic: true,
		sharedWith: [],
		comments: [],
		lists: [],
		pinnedItems: []
	},
	{
		id: "94c8f110-e742-4f02-90b4-4df478bf5e8f",
		name: "Active Shooter Excercise",
		type: "Emergent",
		startDate: 1518682500000,
		endDate: 1519809300000,
		owner: "bc6c9ca9-9e32-487b-b7b8-22b03d24ce13",
		ownerOrg: "ares_security_corporation",
		isPublic: true,
		sharedWith: [],
		comments: [],
		lists: [],
		pinnedItems: []
	},
	{
		id: "94c8f110-e742-4f02-90b4-4df478bf5e8g",
		name: "Shared Excercise",
		type: "Emergent",
		startDate: 1518682500000,
		endDate: 1519809300000,
		owner: "bc6c9ca9-9e32-487b-b7b8-22b03d24ce17",
		ownerOrg: "another_org",
		isPublic: true,
		sharedWith: [],
		comments: [],
		lists: [],
		pinnedItems: ["aishub.245854000"]
	}
];

export const lists = [
	{
		createdDate: "Fri Feb 16 2018 20:23:48 GMT+00:00",
		deleted: false,
		id: "02ffc89d-c8c8c8-fdsfes-9237592",
		isPublic: true,
		lastModifiedDate: "Fri Feb 16 2018 20:23:48 GMT+00:00",
		owner: "2c9c0362-3333-4444-9976-39259317951",
		ownerOrg: "ares_security_corporation",
		properties: [
			{
				label: "Name",
				property: "name",
				type: "text"
			},
			{
				label: "Facility",
				property: "facility",
				type: "text"
			},
			{
				label: "Phone",
				property: "phone",
				type: "text"
			},
			{
				label: "Email",
				property: "email",
				type: "text"
			}
		],
		rows: [
			{
				name: "Guard A",
				facility: "Guard Facilty",
				phone: "800-555-3000",
				email: "example@example.com"
			},
			{
				name: "Guard B",
				facility: "Guard Facilty",
				phone: "800-555-3000",
				email: "example@example.com"
			},
			{
				name: "Guard C",
				facility: "Guard Facilty",
				phone: "800-555-3000",
				email: "example@example.com"
			},
			{
				name: "Guard D",
				facility: "Guard Facilty",
				phone: "800-555-3000",
				email: "example@example.com"
			}
		],
		title: "Facility Contact List",
		type: "text"
	}
];

export const items = [
	{
		appId: "vessels-app",
		entityData: {
			geometry: {
				coordinates: [-90.223125, 29.944201666666668],
				type: "Point"
			},
			properties: {
				callsign: "PCPK",
				countryCode: "NL",
				countryOfOrigin: "Netherlands",
				course: 99.7,
				disposition: "unknown",
				draught: 8.2,
				iconType: "vessel_big",
				imo: 9646780,
				length: 180,
				mmsi: "245854000",
				msglen: 28,
				name: "HANZE GOTEBORG",
				navstatusname: "At anchor",
				sourceId: "245854000",
				speed: 0,
				timestamp: 1518804525.033,
				type: "Track",
				vesselType: "Cargo, all ships of this type",
				width: 30
			}
		},
		entityType: "track",
		feedId: "aishub",
		id: "aishub.245854000",
		isActive: true,
		ownerOrg: "ares_security_corporation",
		sourceId: "245854000",
		timestamp: "Fri Feb 16 2018 18:08:45 GMT+00:00"
	},
	{
		appId: "mapgl-app",
		createdDate: 1514902424.398,
		entityData: {
			geometry: {
				coordinates: [
					[
						[-91.19778487229205, 29.681604201367293],
						[-91.19648681198171, 29.680516729481226],
						[-91.20103912144698, 29.67201567602862],
						[-91.2003346335985, 29.679348691028252],
						[-91.19778487229205, 29.681604201367293]
					]
				],
				type: "Polygon"
			},
			properties: {
				description: "",
				name: "Restricted Zone",
				type: "Polygon"
			},
			type: "Polygon"
		},
		entityType: "shapes",
		feedId: "shapes",
		id: "2ae4acb2-32f4-4901-9420-0c5659cf080c",
		isDeleted: false,
		isShareable: true,
		lastModifiedBy: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		lastModifiedDate: 1514924186.703,
		owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		ownerOrg: "ares_security_corporation"
	}
];
