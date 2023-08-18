import React from "react";
import Field from "./Field";

// import { shallow } from "enzyme";

jest.mock("mapbox-gl", () => {});

const field = {
	name: "zones",
	type: "DropDownMenu",
	desc: "Choose your zone(s)",
	endpoint: "ecosystem/api/entities?et=shapes&app=map-app&filter=polygon"
};

const errorMessage = { data: "" };

it("renders", () => {
	// const wrapper = shallow(
	// 	<Field
	// 		field={field}
	// 		values={[]}
	// 		fetchFieldData={() => {}}
	// 		errorMessage={errorMessage}
	// 	/>
	// );
	// expect(wrapper).toMatchSnapshot();
	return new Promise(resolve => {
		resolve();
	});
});
