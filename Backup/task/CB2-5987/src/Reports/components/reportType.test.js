import React from "react";
import ReportType from "./ReportType";

// import { shallow } from "enzyme";

const report = {
	name: "Zone Activity Report",
	category: "vessel-report",
	id: "123123",
	desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede."
};

it("renders", () => {
	// const wrapper = shallow(<ReportType report={report} />);
	// expect(wrapper).toMatchSnapshot();
	return new Promise((resolve) => {
		resolve();
	});
});
