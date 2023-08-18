export const lists = {
	"3ffacd77-4880-4a20-942a-458e4880f242": {
		createdDate: "Thu Mar 22 2018 13:52:06 GMT+00:00",
		deleted: false,
		id: "3ffacd77-4880-4a20-942a-458e4880f242",
		isPublic: true,
		lastModifiedDate: "Thu Mar 22 2018 13:52:06 GMT+00:00",
		owner: "bc6c9ca9-9e32-487b-b7b8-22b03d24ce13",
		ownerOrg: "ares_security_corporation",
		columns: [
			{
				name: "Name",
				id: "name",
				type: "text",
				order: 0,
				required: true,
				defaultValue: ""
			},
			{
				name: "Facility",
				id: "facility",
				type: "text",
				order: 1,
				defaultValue: ""
			},
			{
				name: "Phone",
				id: "phone",
				type: "text",
				order: 2,
				defaultValue: ""
			},
			{
				name: "Email",
				id: "email",
				type: "text",
				order: 3,
				defaultValue: ""
			}
		],
		rows: [
			{
				data: {
					name: "Bubba Bubbason",
					facility: "Darlington Raceway",
					phone: "(800) 789-9876 ext 222",
					email: "myemail@email.com"
				},
				order: 0
			},
			{
				data: {
					name: "Darth Vader",
					facility: "Death Star",
					phone: "(800) 789-9876 ext 222",
					email: "myemail@email.com"
				},
				order: 1
			},
			{
				data: {
					name: "Don Henley",
					facility: "Hotel California",
					phone: "(800) 789-9876 ext 222",
					email: "myemail@email.com"
				},
				order: 2
			},
			{
				data: {
					name: "Big Bird",
					facility: "Sesame Street",
					phone: "(800) 789-9876 ext 222",
					email: "myemail@email.com"
				},
				order: 3
			},
			{
				data: {
					name: "Fresh Prince",
					facility: "Bel Air",
					phone: "(800) 789-9876 ext 222",
					email: "myemail@email.com"
				},
				order: 4
			},
			{
				data: {
					name: "Mister Rogers",
					facility: "Neighborhood",
					phone: "(800) 789-9876 ext 222",
					email: "myemail@email.com"
				},
				order: 5
			}
		],
		targetId: null,
		targetType: null,
		name: "Local First Responders",
		category: "contacts_category_id"
	},
	"2af192da-ae97-46ba-b506-423431f6b7ea": {
		createdDate: "Thu Mar 22 2018 13:52:30 GMT+00:00",
		deleted: false,
		id: "2af192da-ae97-46ba-b506-423431f6b7ea",
		isPublic: true,
		lastModifiedDate: "Thu Mar 22 2018 13:52:30 GMT+00:00",
		owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		ownerOrg: "ares_security_corporation",
		columns: [
			{
				name: "Complete",
				id: "complete",
				type: "checkbox",
				order: 0,
				defaultValue: "checked",
				options: [
					{
						id: "not-checked",
						name: "Not Checked",
						value: false,
						required: true
					},
					{ id: "checked", name: "Checked", value: true }
				]
			},
			{
				name: "Item",
				id: "item",
				type: "text",
				order: 1,
				required: true,
				defaultValue: ""
			},
			{
				name: "Type",
				id: "type",
				type: "choice",
				order: 2,
				defaultValue: "verify",
				options: [
					{ id: "notify", name: "Notify", value: "Notify" },
					{ id: "verify", name: "Verify", value: "Verify" }
				]
			},
			{
				name: "Assignee",
				id: "assignee",
				type: "text",
				order: 3,
				defaultValue: ""
			}
		],
		rows: [
			{
				data: {
					complete: false,
					item: "Jiggle doorknob",
					type: "Verify",
					assignee: "George Jones"
				},
				order: 0
			}
		],
		targetId: null,
		targetType: null,
		name: "Intrusion Event",
		category: ""
	},
	other_sop_list: {
		createdDate: "Thu Mar 22 2018 13:52:30 GMT+00:00",
		deleted: false,
		id: "other_sop_list",
		isPublic: true,
		lastModifiedDate: "Thu Mar 22 2018 13:52:30 GMT+00:00",
		owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		ownerOrg: "ares_security_corporation",
		columns: [
			{
				name: "Complete",
				id: "complete",
				type: "checkbox",
				order: 0,
				defaultValue: "checked",
				options: [
					{
						id: "not-checked",
						name: "Not Checked",
						value: false,
						required: true
					},
					{ id: "checked", name: "Checked", value: true }
				]
			},
			{
				name: "Item",
				id: "item",
				type: "text",
				order: 1,
				required: true,
				defaultValue: ""
			},
			{
				name: "Type",
				id: "type",
				type: "choice",
				order: 2,
				defaultValue: "verify",
				options: [
					{ id: "notify", name: "Notify", value: "Notify" },
					{ id: "verify", name: "Verify", value: "Verify" }
				]
			},
			{
				name: "Assignee",
				id: "assignee",
				type: "text",
				order: 3,
				defaultValue: ""
			},
			{
				name: "End Date",
				id: "endDate",
				type: "date-time",
				order: 3,
				includeTime: true,
				defaultValue: "9/18/2018 0800"
			}
		],
		rows: [
			{
				data: {
					complete: true,
					item: "Jiggle doorknob",
					type: "Verify",
					assignee: "George Jones",
					endDate: "9/18/2018 0800"
				},
				order: 0
			},
			{
				data: {
					complete: false,
					item: "Call Mom",
					type: "Notify",
					assignee: "George Michael",
					endDate: "9/18/2018 0800"
				},
				order: 1
			},
			{
				data: {
					complete: false,
					item: "Let the dogs out",
					type: "Verify",
					assignee: "Boy George",
					endDate: "9/18/2018 0800"
				},
				order: 2
			}
		],
		targetId: null,
		targetType: null,
		name: "Party Starting Event",
		category: "sop_category_id"
	}
};

export const categories = {
	sop_category_id: {
		name: "Standard Operating Procedures",
		owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		ownerOrg: "ares_security_corporation",
		id: "sop_category_id"
	},
	contacts_category_id: {
		name: "Contacts",
		owner: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		ownerOrg: "ares_security_corporation",
		id: "contacts_category_id"
	}
};
