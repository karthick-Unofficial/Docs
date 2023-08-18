const orgRolesData = {
	"organization": {
		"canShare": true,
		"canEdit": false
	},
	"orgId": "officia magna nulla voluptate",
	"roleId": "ipsum est qui veniam",
	"ecosystem": {"canShare": true},
	"title": "dolor sit elit est cu",
	"createdDate": new Date(),
	"lastModifiedDate": new Date()
};

const orgRolesDataArr = [
	{
		"organization": {
			"canShare": true,
			"canContribute": false
		},
		"orgId": "nulla volu",
		"roleId": "sunt voluptate",
		"ecosystem": {
			"canShare": true,
			"canView": false
		},
		"title": "Duis",
		"createdDate": new Date(),
		"lastModifiedDate": new Date()
	},
	{
		"organization": {"canShare": true},
		"orgId": "enim",
		"roleId": "in Excepteur consectetur eiusmod Ut",
		"events": {
			"canShare": true,
			"canContribute": false
		},
		"title": "nisi ex nulla dolore",
		"createdDate": new Date(),
		"lastModifiedDate": new Date()
	},
	{
		"organization": {"canShare": false},
		"orgId": "proident adipisicing Lorem",
		"roleId": "labore velit ea eu magna",
		"ecosystem": {
			"canShare": true,
			"canView": true
		},
		"title": "officia aute",
		"createdDate": new Date(),
		"lastModifiedDate": new Date()
	}
];

export { orgRolesData, orgRolesDataArr };