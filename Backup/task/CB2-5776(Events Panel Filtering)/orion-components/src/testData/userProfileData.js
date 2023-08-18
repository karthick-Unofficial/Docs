export const userProfileData = {
	org: {
		description: "Worldwide leader in situational awareness",
		disabled: false,
		id: "958338df-c3b8-4f88-98a7-c9846fd34e74",
		lastModifiedDate: "2018-02-27T14:47:16.714Z",
		name: "Ares Security Corporation",
		orgId: "ares_security_corporation"
	},
	user: {
		admin: true,
		applications: [
			{
				appId: "rules-app",
				config: { canView: true, role: "viewer" },
				icon: "",
				name: "Rules"
			},
			{
				appId: "map-app",
				config: { canView: true, role: "viewer" },
				icon: "",
				name: "Map"
			},
			{
				appId: "reports-app",
				config: { canView: true, role: "viewer" },
				icon: "",
				name: "Reports"
			}
		],
		attachments: [
			{
				app: "settings_app",
				createdBy: "2c9c0362-345b-4f33-9976-219a4566b9c3",
				createdDate: "2017-12-29T19:45:25.590Z",
				filename: "Duck.jpeg",
				handle: "user.2c9c0362-345b-4f33-9976-219a4566b9c3.ce2dcbf0-ecd0-11e7-a85b-e32904647b81",
				id: "71c84bcf-ed44-4a14-9b53-833908c79109",
				mimeType: "image/jpeg",
				targetId: "2c9c0362-345b-4f33-9976-219a4566b9c3",
				targetType: "user"
			}
		],
		contact: {
			address: "1501 Main Street,Suite 120 Columbia,SC 29201",
			cellPhone: null,
			city: null,
			email: "orgadmin@aressecuritycorp.com",
			officePhone: null,
			phone: "803-339-0697",
			state: null,
			zip: null
		},
		disabled: false,
		ecoAdmin: false,
		email: "orgadmin@aressecuritycorp.com",
		id: "2c9c0362-345b-4f33-9976-219a4566b9c3",
		integrations: [
			{
				appId: "tracker-app",
				config: {
					appId: "tracker-app",
					canView: true,
					entityType: "track",
					feedId: "mobile-tracker",
					id: "6e699df0-b8c4-411b-97b5-7dcabdce6a00",
					labels: {
						displayName: [
							{ prefix: "", property: "displayName" },
							{ prefix: "deviceId:", property: "deviceId" }
						]
					},
					metadata: { for: "integration server" },
					name: "CB Mobile Tracker",
					ownerOrg: "ares_security_corporation",
					role: "viewer",
					source: "int"
				},
				entityType: "track",
				feedId: "mobile-tracker",
				labels: {
					displayName: [
						{ prefix: "", property: "displayName" },
						{ prefix: "deviceId:", property: "deviceId" }
					]
				},
				name: "CB Mobile Tracker",
				ownerOrg: "ares_security_corporation",
				source: "int"
			},
			{
				appId: "map-app",
				config: { canView: true, role: "viewer" },
				entityType: "shapes",
				feedId: "shapes",
				labels: {
					displayName: [
						{ prefix: "", property: "name" },
						{ prefix: "mmsi:", property: "mmsi" },
						{ prefix: "callsign:", property: "callsign" }
					]
				},
				name: "Shapes",
				source: "app"
			},
			{
				appId: "vessels-app",
				config: {
					appId: "vessels-app",
					canView: true,
					displayProperties: {
						callsign: "Call Sign",
						destination: "Destination",
						draught: "Draft",
						imo: "IMO",
						length: "Length",
						mmsi: "MMSI",
						navstatusname: "Navigation Status",
						timestamp: "Last Updated",
						width: "Width"
					},
					entityType: "track",
					feedId: "aishub",
					id: "3dc30971-46f0-477f-8c82-ddd5080bc00d",
					labels: {
						displayName: [
							{ prefix: "", property: "name" },
							{ prefix: "mmsi:", property: "mmsi" },
							{ prefix: "callsign:", property: "callsign" }
						]
					},
					metadata: { for: "integration server" },
					name: "AISHUB",
					ownerOrg: "ares_security_corporation",
					role: "viewer",
					source: "int",
					ttl: 600
				},
				displayProperties: {
					callsign: "Call Sign",
					destination: "Destination",
					draught: "Draft",
					imo: "IMO",
					length: "Length",
					mmsi: "MMSI",
					navstatusname: "Navigation Status",
					timestamp: "Last Updated",
					width: "Width"
				},
				entityType: "track",
				feedId: "aishub",
				labels: {
					displayName: [
						{ prefix: "", property: "name" },
						{ prefix: "mmsi:", property: "mmsi" },
						{ prefix: "callsign:", property: "callsign" }
					]
				},
				name: "AISHUB",
				ownerOrg: "ares_security_corporation",
				source: "int",
				ttl: 600
			},
			{
				appId: "archive-app",
				config: {
					appId: "archive-app",
					canView: true,
					entityType: "track",
					feedId: "track-generator",
					id: "9cc64849-deb4-4e04-9997-d4030a0a0999",
					labels: {
						displayName: [
							{ prefix: "", property: "name" },
							{ prefix: "mmsi:", property: "mmsi" },
							{ prefix: "callsign:", property: "callsign" }
						]
					},
					metadata: { for: "integration server" },
					name: "Test Track Feed",
					ownerOrg: "ares_security_corporation",
					role: "viewer",
					source: "int",
					ttl: 60
				},
				entityType: "track",
				feedId: "track-generator",
				labels: {
					displayName: [
						{ prefix: "", property: "name" },
						{ prefix: "mmsi:", property: "mmsi" },
						{ prefix: "callsign:", property: "callsign" }
					]
				},
				name: "Test Track Feed",
				ownerOrg: "ares_security_corporation",
				source: "int",
				ttl: 60
			}
		],
		lastModifiedDate: "2018-02-26T20:41:28.565Z",
		name: "Org Admin",
		orgId: "ares_security_corporation",
		orgRole: {
			organization: {
				canShare: true,
				canContribute: true,
				canEdit: true,
				canView: true
			},
			lastModifiedDate: "Tue Aug 29 2017 14:26:31 GMT+00:00",
			roleId: "org_admin",
			ecosystem: {
				canShare: true,
				canContribute: true,
				canView: true
			},
			title: "Org Admin"
		},
		profileImage: "user.2c9c0362-345b-4f33-9976-219a4566b9c3.ce2dcbf0-ecd0-11e7-a85b-e32904647b81",
		resetExpires: "2018-02-26T20:57:15.431Z",
		resetToken: "7c4d5b0990447840c47da468c0fd0eeb8808979c",
		role: "system-user",
		roleId: "ares_security_corp_org_admin",
		username: "orgadmin@aressecuritycorp.com"
	}
};
