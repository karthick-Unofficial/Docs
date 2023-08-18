export const activities = [
	{
		actor: {
			id: "2c9c0362-345b-4f33-9976-219a4566b9c3",
			name: "Org Admin",
			type: "user",
			url: "http://localhost/ecosystem/api/users/2c9c0362-345b-4f33-9976-219a4566b9c3"
		},
		app: "ecosystem",
		id: "23498d09-ce01-45d5-81b2-9b49fa3e47ac",
		object: {
			message: "This event involves a carnival and glory!"
		},
		published: "Thu Feb 22 2018 15:30:39 GMT+00:00",
		summary: "Org Admin commented on Carnival Glory",
		target: {
			id: "94c8f110-e742-4f02-90b4-4df478bf5e8b",
			name: "Carnival Glory",
			type: "event",
			url: "http://localhost/ecosystem/api/entities/ae9ad258-d596-4649-9fae-408cd3987407"
		},
		to: [
			{
				email: false,
				pushNotification: true,
				system: true,
				token: "organization:ares_security_corporation"
			}
		],
		type: "comment"
	},
	{
		actor: {
			id: "2c9c0362-345b-4f33-9976-219a4566b9c3",
			name: "Org Admin",
			type: "user",
			url: "http://localhost/ecosystem/api/users/2c9c0362-345b-4f33-9976-219a4566b9c3"
		},
		app: "ecosystem",
		id: "007e9973-fb30-4219-ac8c-2a359ad06193",
		object: {},
		published: "Tue Feb 06 2018 17:54:29 GMT+00:00",
		summary: "Event created",
		target: {
			id: "94c8f110-e742-4f02-90b4-4df478bf5e8b",
			type: "event",
			url: "http://localhost/ecosystem/api/entities/ae9ad258-d596-4649-9fae-408cd3987407"
		},
		to: [
			{
				email: false,
				sms: false,
				system: false,
				token: "user:2c9c0362-345b-4f33-9976-219a4566b9c3"
			}
		],
		type: "created"
	}
];
