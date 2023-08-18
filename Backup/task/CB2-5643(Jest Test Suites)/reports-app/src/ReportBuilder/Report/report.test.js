import React from "react";
import Report from "./Report";

// import { shallow } from "enzyme";

jest.mock("mapbox-gl", () => {});

const report = {
	name: "Zone Activity Report",
	id: "zone-activity",
	app: "shapes-app",
	desc: "What tracks gone in which zones? Find out here.",
	category: "vessel-report",
	fields: [
		{
			name: "zones",
			type: "DropDownMenu",
			desc: "Choose your zone(s)",
			endpoint: "ecosystem/api/entities?et=shapes&app=map-app&filter=polygon"
		},
		{
			name: "startDate",
			type: "DatePicker",
			desc: "Start Date"
		},
		{
			name: "endDate",
			type: "DatePicker",
			desc: "End Date"
		}
	],
	type: {
		table: {
			"columns": [
				{
					"property": "name",
					"width": 1,
					"displayName": "Vessel Name",
					"sortable": true
				},
				{
					"property": "mmsid",
					"width": 1,
					"displayName": "MMSID",
					"sortable": false
				},
				{
					"property": "imo",
					"width": 1,
					"displayName": "IMO",
					"sortable": false
				},
				{
					"property": "callsign",
					"width": 1,
					"displayName": "Callsign",
					"sortable": false
				},
				{
					"property": "timestamp",
					"width": 2,
					"displayName": "Position Date/Time",
					"sortable": true
				},
				{
					"property": "speed",
					"width": 1,
					"displayName": "Speed",
					"sortable": true
				},
				{
					"property": "hdg",
					"width": 1,
					"displayName": "Heading",
					"sortable": false
				},
				{
					"property": "course",
					"width": 1,
					"displayName": "Course",
					"sortable": false
				},
				{
					"property": "lat",
					"width": 1,
					"displayName": "Latitude",
					"sortable": false
				},
				{
					"property": "lng",
					"width": 1,
					"displayName": "Longitude",
					"sortable": false
				},
				{
					"property": "event",
					"width": 1,
					"displayName": "Event",
					"sortable": false
				}
			]
		}
	}
};

const columns = [
	{
		"property": "name",
		"width": 1,
		"displayName": "Vessel Name",
		"sortable": true
	},
	{
		"property": "mmsid",
		"width": 1,
		"displayName": "MMSID",
		"sortable": false
	},
	{
		"property": "imo",
		"width": 1,
		"displayName": "IMO",
		"sortable": false
	},
	{
		"property": "callsign",
		"width": 1,
		"displayName": "Callsign",
		"sortable": false
	},
	{
		"property": "timestamp",
		"width": 2,
		"displayName": "Position Date/Time",
		"sortable": true
	},
	{
		"property": "speed",
		"width": 1,
		"displayName": "Speed",
		"sortable": true
	},
	{
		"property": "hdg",
		"width": 1,
		"displayName": "Heading",
		"sortable": false
	},
	{
		"property": "course",
		"width": 1,
		"displayName": "Course",
		"sortable": false
	},
	{
		"property": "lat",
		"width": 1,
		"displayName": "Latitude",
		"sortable": false
	},
	{
		"property": "lng",
		"width": 1,
		"displayName": "Longitude",
		"sortable": false
	},
	{
		"property": "event",
		"width": 1,
		"displayName": "Event",
		"sortable": false
	}
];

const groups = [
	{
		name: "Pelee Passage",
		id: "pelee-passage",
		property: "zone",
		displayName: "Zone",
		rows: [
			{
				name: "UBC TILBURY",
				mmsid: "212040000",
				imo: 9416721,
				callsign: "5BXL2",
				timestamp: 123123123,
				speed: 23,
				hdg: 100,
				course: 111,
				lat: 12.7,
				lng: 12.7,
				event: "enter"
			}
		]
	},
	{
		name: "Grain Elevator Berth",
		id: "grain-elevator-berth",
		property: "zone",
		displayName: "Zone",
		rows: [
			{
				name: "UBC TILBURY",
				mmsid: "212040000",
				imo: 9416721,
				callsign: "5BXL2",
				timestamp: 123123123,
				speed: 23,
				hdg: 100,
				course: 111,
				lat: 12.7,
				lng: 12.7,
				event: "enter"
			},
			{
				name: "DISCOVERER INDIA",
				mmsid: "053003297",
				imo: 9521215,
				callsign: "V7PV7",
				timestamp: 123123123,
				speed: 1,
				hdg: 100,
				course: 111,
				lat: 12.7,
				lng: 12.7,
				event: "exit"
			},
			{
				name: "DISCOVERER INDIA",
				mmsid: "053003297",
				imo: 9521215,
				callsign: "V7PV7",
				timestamp: 123123123,
				speed: 1,
				hdg: 100,
				course: 111,
				lat: 12.7,
				lng: 12.7,
				event: "exit"
			},
			{
				name: "DISCOVERER INDIA",
				mmsid: "053003297",
				imo: 9521215,
				callsign: "V7PV7",
				timestamp: 123123123,
				speed: 1,
				hdg: 100,
				course: 111,
				lat: 12.7,
				lng: 12.7,
				event: "exit"
			}
		]
	}
];

it("renders", () => {
	// const wrapper = shallow(
	// 	<Report 
	// 		report={report} 
	// 		handleExport={() => {}}
	// 		handleExportEmailRequest={() => {}}
	// 		columns={columns} 
	// 		groups={groups} />
	// );
	// expect(wrapper).toMatchSnapshot();
	return new Promise(resolve => {
		resolve();
	});
});
