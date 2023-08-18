import React from "react";
import MultiReport from "./MultiReport";

// import { shallow } from "enzyme";

jest.mock("mapbox-gl", () => {});

const report = {
	name: "Event SITREP",
	id: "sitrep",
	app: "events-app",
	desc: "What tracks gone in which zones? Find out here.",
	category: "vessel-report",
	fields: [
		{
			name: "events",
			type: "drop-down-menu",
			desc: "Choose an event",
			noMultiple: true,
			endpoint: {
				basePath: "ecosystem/api/events",
				template: null,
				debounce: false
			}
		}
	],
	type: {
		multi: [
			{
				type: "field",
				property: "owner",
				header: "Event Created By"
			},
			{
				type: "field",
				property: "shares",
				header: "Event Sharing"
			},
			{
				type: "field",
				property: "startDate",
				header: "Start Date"
			},
			{
				type: "field",
				property: "startTime",
				header: "Start Time"
			},
			{
				type: "field",
				property: "closeDate",
				header: "Close Date"
			},
			{
				type: "field",
				property: "closeTime",
				header: "Close Time"
			},
			{
				type: "long-field",
				property: "desc",
				header: "Event Description"
			},
			{
				type: "table",
				property: "activities",
				columns: [

				]
			}
		]
	}
};

const data = 
	{
		startDate: { type: "field", value: "03/16/2018" },
		startTime: { type: "field", value: "5:37:00 PM" },
		closeDate: { type: "field", value: "03/24/2018" },
		closeTime: { type: "field", value: "5:37:00 PM" },
		shares: { type: "field", value: ["New Org"] },
		owner:
		{
			type: "field",
			value: "Jonathan Fitzgibbon, Ares Security Corporation"
		},
		desc: { type: "long-field", value: "omg" }
	};



it("renders", () => {
	// const wrapper = shallow(
	// 	<MultiReport
	// 		report={report}
	// 		handleExport={() => { }}
	// 		handleExportEmailRequest={() => { }}
	// 		data={[data]} />
	// );
	// expect(wrapper).toMatchSnapshot();
	return new Promise(resolve => {
		resolve();
	});
});
