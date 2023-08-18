import React from "react";
import WidgetCard from "./WidgetCard";

import { shallow } from "enzyme";

describe("WidgetCard", () => {
	const widget = {
		name: "Alerts",
		id: "alerts",
		enabled: true
	};

	it("renders", () => {
		const wrapper = shallow(
			<WidgetCard widget={widget} enable={() => {}} disable={() => {}} />
		);
		expect(wrapper).toMatchSnapshot();
	});
});
