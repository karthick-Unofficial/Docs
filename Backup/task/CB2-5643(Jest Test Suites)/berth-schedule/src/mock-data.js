import moment from "moment";
export const assignments = [
	{
		id: "123",
		agent: {
			name: { firstName: "", lastName: "" },
			email: "",
			company: "",
			phone: ""
		},
		requestedBy: {
			company: "",
			name: { firstName: "", lastName: "" },
			email: "",
			phone: ""
		},
		vessel: {
			id: "aishub.366963880",
			name: "VIRGINIA",
			mmsid: "366963880",
			imo: "0",
			loa: 600,
			type: "tanker",
			grt: Math.random()
		},
		barges: [
			{
				grt: 584,
				id: "0e45f89f-5b82-4bec-a02e-1be3463de5a2",
				loa: 300,
				name: "Big Ol' Barge",
				registry: "12345678",
				type: "ocean-barge"
			}
		],
		cargo: [
			{
				commodity: "Plague Rats",
				shipperReceiver: {
					company: "Amazon",
					id: "4e4e9e8b-e2f0-4e9f-b77d-961b4be46928"
				},
				weight: "12.34"
			}
		],
		schedule: {
			eta: moment().add(1, "d"),
			etd: moment().add(2, "d"),
			ata: moment().add(1, "d"),
			atd: moment().add(2, "d")
		},
		berth: {
			id: "f3e9559d-6ae3-422e-ac96-73c1df85a6d9",
			footmark: 100
		},
		approved: true
	},
	{
		id: "345",
		agent: {
			name: { firstName: "", lastName: "" },
			email: "",
			company: "",
			phone: ""
		},
		requestedBy: {
			company: "",
			name: { firstName: "", lastName: "" },
			email: "",
			phone: ""
		},
		vessel: {
			id: "aishub.366999513",
			name: "CG AXE",
			mmsid: "366999513",
			imo: "0",
			loa: 375,
			type: "tanker",
			grt: Math.random()
		},
		barges: [],
		cargo: [],
		schedule: {
			eta: moment(),
			etd: moment().add(3, "d"),
			ata: moment(),
			atd: moment().add(3, "d")
		},
		berth: {
			id: "fa895d9e-be1e-4bea-8d6e-4fcc0650b941",
			footmark: 900
		},
		approved: true
	},
	{
		id: "567",
		agent: {
			name: { firstName: "", lastName: "" },
			email: "",
			company: "",
			phone: ""
		},
		requestedBy: {
			company: "",
			name: { firstName: "", lastName: "" },
			email: "",
			phone: ""
		},
		vessel: {
			id: "aishub.366793340",
			name: "SQUEAK CARPENTER",
			mmsid: "366793340",
			imo: "8635679",
			loa: 400,
			type: "tanker",
			grt: Math.random()
		},
		barges: [],
		cargo: [],
		schedule: {
			eta: moment().add(2, "d"),
			etd: moment().add(4, "d"),
			ata: moment().add(2, "d"),
			atd: moment().add(4, "d")
		},
		berth: {
			id: "",
			footmark: ""
		},
		approved: false
	}
];

export const berths = [
	{
		name: "Molasses Pier",
		id: "abc",
		berthGroupId: "",
		shapeId: "",
		beginningFootmark: 0,
		endFootmark: 450
	},
	{
		name: "Dock 1",
		id: "def",
		berthGroupId: "",
		shapeId: "",
		beginningFootmark: 450,
		endFootmark: 1081
	},
	{
		name: "Extension Pier",
		id: "ghi",
		berthGroupId: "",
		shapeId: "",
		beginningFootmark: 1081,
		endFootmark: 1356
	},
	{
		name: "Dock 2",
		id: "jkl",
		berthGroupId: "",
		shapeId: "",
		beginningFootmark: 1356,
		endFootmark: 2008
	}
];

export const berthGroups = [{ name: "Main Dock", id: "mno" }];
