import React from "react";
import NewNotificationItem from "./NewNotificationItem";

import { shallow } from "enzyme";

// import { initialState } from './reducers/user.js';

// Mock Date object
const DATE_TO_USE = new Date("2017");
const _Date = Date;
global.Date = jest.fn(() => DATE_TO_USE);
global.Date.UTC = _Date.UTC;

const notification = {"activityId":"5b391797-4594-45c1-a6b5-f11058f0e860",
	"actor":{"id":"b617dedf-9e59-418d-9737-fb6cae298ef3",
		"name":"Test User",
		"type":"user",
		"url":"http://localhost/ecosystem/api/users/b617dedf-9e59-418d-9737-fb6cae298ef3"},
	"app":"ecosystem",
	"closed":false,
	"createdDate":"2017-10-16T18:47:09.150Z",
	"id":"c71ed13e-0d2e-42f6-aeee-98f5a186bc41",
	"isPriority":false,
	"lastModifiedDate":"2017-10-16T18:47:09.150Z",
	"message":"Test User posted Post Test E in Daily Brief",
	"object":{"id":"4aedc1eb-c9a4-4545-9ea5-02638beea57c",
		"name":"Post Test E",
		"type":"brief",
		"url":"http://localhost/ecosystem/api/entities/4aedc1eb-c9a4-4545-9ea5-02638beea57c"},
	"published":"2017-10-16T18:47:08.999Z",
	"summary":"Test User posted Post Test E in Daily Brief",
	"target":{"id":"ares_security_corporation",
		"name":"Ares Security Corporation",
		"type":"organization",
		"url":"http://localhost/ecosystem/api/organizations/ares_security_corporation"},
	"to":[{"email":false,
		"sms":false,
		"system":true,
		"token":"organization:ares_security_corporation"}],
	"type":"created",
	"userId":"ddd72afd-b7c6-4f60-a58d-da24d2ed1f19",
	"viewed":false};

describe("NewNotificationItem", () => {
    																																																												it("renders", () => {
		// Basic render with a couple dock items

        																																																												const wrapper = shallow(
			<NewNotificationItem 
				notification={notification}
			/>
		);
        																																																												expect(wrapper).toMatchSnapshot();
	});
});