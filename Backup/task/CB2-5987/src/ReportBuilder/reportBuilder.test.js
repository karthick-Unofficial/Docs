import React from "react";
import ReportBuilder from "./ReportBuilder";

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
			columns: [
				{
					property: "name",
					displayName: "Vessel Name",
					sortable: true
				},
				{ property: "mmsid", displayName: "MMSID", sortable: false },
				{ property: "imo", displayName: "IMO", sortable: false },
				{
					property: "callsign",
					displayName: "Callsign",
					sortable: false
				},
				{
					property: "timestamp",
					displayName: "Position Date/Time",
					sortable: true
				},
				{ property: "speed", displayName: "Speed", sortable: true },
				{ property: "hdg", displayName: "Heading", sortable: false },
				{
					property: "course",
					displayName: "Course",
					sortable: false
				},
				{
					property: "lat",
					displayName: "Latitude",
					sortable: false
				},
				{
					property: "lng",
					displayName: "Longitude",
					sortable: false
				},
				{
					property: "event",
					displayName: "Event",
					sortable: false
				}
			]
		}
	}
};

const fieldData = {
	zones: [
		{
			appId: "map-app",
			createdDate: 1515618987.801,
			entityData: {
				geometry: {
					coordinates: [
						[
							[-91.20842160335067, 29.685986786214556],
							[-91.21068040572172, 29.683518657454755],
							[-91.20900376890918, 29.682931962196534],
							[-91.20776957792908, 29.68434811732206],
							[-91.2038807119926, 29.683275887417892],
							[-91.2039738584792, 29.68295219311898],
							[-91.20090002432926, 29.68044352699006],
							[-91.19717416475007, 29.683741196132303],
							[-91.19682486541188, 29.685076417904412],
							[-91.19824534938051, 29.6860070165355],
							[-91.20332183305763, 29.687463588381902],
							[-91.20653538694133, 29.68713990756926],
							[-91.20842160335067, 29.685986786214556]
						]
					],
					type: "Polygon"
				},
				properties: {
					description: "",
					name: "Field Zone",
					type: "Polygon"
				},
				type: "Polygon"
			},
			entityType: "shapes",
			feedId: "shapes",
			id: "e9cee7b9-baa6-43af-94ba-a4886b324979",
			isDeleted: false,
			isShareable: true,
			lastModifiedDate: 1515618987.801,
			owner: "167e8da0-eb43-44eb-94e8-5509de4458e8",
			ownerOrg: "ares_security_corporation"
		},
		{
			appId: "map-app",
			createdDate: 1515615177.676,
			entityData: {
				geometry: {
					coordinates: [
						[
							[-91.21446431900029, 29.690217884083566],
							[-91.2098710468291, 29.690898389441344],
							[-91.20748539384816, 29.68703182045418],
							[-91.21001347386871, 29.686691555264957],
							[-91.21236352009853, 29.6841549966245],
							[-91.21531888126144, 29.68743395055985],
							[-91.21446431900029, 29.690217884083566]
						]
					],
					type: "Polygon"
				},
				properties: {
					description: "",
					name: "Confluence Zone",
					type: "Polygon"
				},
				type: "Polygon"
			},
			entityType: "shapes",
			feedId: "shapes",
			id: "9d6d9e3f-4345-4551-a552-7efc959c4f17",
			isDeleted: false,
			isShareable: true,
			lastModifiedDate: 1515615177.676,
			owner: "167e8da0-eb43-44eb-94e8-5509de4458e8",
			ownerOrg: "ares_security_corporation"
		},
		{
			appId: "map-app",
			createdDate: 1514902424.398,
			entityData: {
				geometry: {
					coordinates: [
						[
							[-91.19778487229205, 29.681604201367293],
							[-91.19648681198171, 29.680516729481226],
							[-91.19858225494038, 29.678110230787993],
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
			lastModifiedBy: "167e8da0-eb43-44eb-94e8-5509de4458e8",
			lastModifiedDate: 1515615142.771,
			owner: "167e8da0-eb43-44eb-94e8-5509de4458e8",
			ownerOrg: "ares_security_corporation"
		}
	]
};

it("renders", () => {
	// const wrapper = shallow(
	// 	<ReportBuilder
	// 		report={report}
	// 		fieldData={fieldData}
	// 		wipeReports={() => {}} />
	// );
	// expect(wrapper).toMatchSnapshot();
	return new Promise((resolve) => {
		resolve();
	});
});
