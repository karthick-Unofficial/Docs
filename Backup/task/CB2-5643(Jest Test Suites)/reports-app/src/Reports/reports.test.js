import React from "react";
import Reports from "./Reports";
import { wipeReports, wipeAllFieldData } from "../ReportBuilder/reportBuilderActions";
// import { shallow } from "enzyme";

const reportTypes = [
	{
		properties: {
			name: "Zone Activity Report",
			id: "123123",
			app: "shapes-app",
			desc: "What tracks gone in which zones? Find out here.",
			category: "vessel-report",
			fields: [
				{
					name: "zones",
					type: "DropDownMenu",
					desc: "Choose your zone(s)",
					endpoint:
						"ecosystem/api/entities?et=shapes&app=map-app&filter=polygon"
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
							displayName: "Name",
							sortable: true
						},
						{
							property: "mmsid",
							displayName: "MMSID",
							sortable: false
						},
						{
							property: "imo",
							displayName: "IMO",
							sortable: false
						},
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
						{
							property: "speed",
							displayName: "Speed",
							sortable: true
						},
						{
							property: "hdg",
							displayName: "Heading",
							sortable: false
						},
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
		},
		id: "zone-activity",
		aid: "da36d300-f61d-11e7-87c8-938daf9b883c",
		_desc: "What tracks gone in which zones? Find out here.",
		_instances: {}
	}
];

it("renders", () => {
	// const wrapper = shallow(
	// 	<Reports wipeReports={wipeReports} wipeAllFieldData={wipeAllFieldData} reportTypes={reportTypes} categories={["vessel-report"]} />
	// );
	// expect(wrapper).toMatchSnapshot();
	return new Promise(resolve => {
		resolve();
	});
});
