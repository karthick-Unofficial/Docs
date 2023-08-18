const session = {
	identity: {
		isAuthenticated: true,
		userId: "60392aec-53de-4ff2-84ab-f1ca3cf4f0db",
		email: "ecoadmin@aressecuritycorp.com"
	},
	user: {
		isHydrated: true,
		profile: {
			admin: true,
			appSettings: {
				locale: "en",
				spotlightProximity: {
					unit: "mi",
					value: 0.25
				},
				timeFormat: "24-hour",
				trackHistory: {
					duration: 30
				},
				tts: {
					enabled: true,
					type: null
				},
				unitsOfMeasurement: {
					coordinateSystem: "decimal-degrees",
					landUnitSystem: "imperial"
				}
			},
			applications: [
				{
					appId: "rules-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Rules",
					permissions: ["manage"]
				},
				{
					appId: "units-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Units",
					permissions: ["manage"]
				},
				{
					appId: "map-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Map",
					permissions: ["manage"]
				},
				{
					appId: "tabletop-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Tabletop",
					permissions: []
				},
				{
					appId: "lists-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Lists",
					permissions: ["manage"]
				},
				{
					appId: "champ-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Champ",
					permissions: []
				},
				{
					appId: "mpo-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "MPO",
					permissions: ["manage", "admin"]
				},
				{
					appId: "reports-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Reports",
					permissions: []
				},
				{
					appId: "camera-wall-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Camera Wall",
					permissions: []
				},
				{
					appId: "facilities-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Facilities",
					permissions: []
				},
				{
					appId: "berth-schedule-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Berth Schedule",
					permissions: ["manage"]
				},
				{
					appId: "law-enforcement-search-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "LE Search",
					permissions: ["manage"]
				},
				{
					appId: "brc-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "BRC",
					permissions: ["manage"]
				},
				{
					appId: "events-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Events",
					permissions: ["share", "manage"]
				},
				{
					appId: "replay-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Replay",
					permissions: []
				},
				{
					appId: "cameras-app",
					config: {
						canView: true,
						role: "viewer"
					},
					icon: "",
					name: "Cameras",
					permissions: []
				}
			],
			attachments: [],
			authProviderId: "system",
			contact: {
				address: "1501 Main Street, Suite 120 Columbia, SC 29201",
				cellPhone: null,
				email: "ecoadmin@aressecuritycorp.com",
				officePhone: null,
				phone: "803-339-0697"
			},
			disabled: false,
			ecoAdmin: true,
			email: "ecoadmin@aressecuritycorp.com",
			failedLoginAttempts: 0,
			firstUseAck: true,
			id: "60392aec-53de-4ff2-84ab-f1ca3cf4f0db",
			lastModifiedDate: "2023-01-18T05:18:55.121Z",
			lockedUntil: null,
			name: "Support Admin",
			orgId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			orgRole: {
				ecosystem: {
					canContribute: true,
					canShare: true,
					canView: true
				},
				initialRole: true,
				lastModifiedDate: "2023-01-06T14:04:07.772Z",
				organization: {
					canContribute: true,
					canEdit: true,
					canShare: true,
					canView: true
				},
				roleId: "org_admin",
				title: "Org Admin"
			},
			profileImage: "9a7e1de0-96ef-11ed-9135-e1b6c680c10a",
			role: "eco-admin",
			roleId: "ares_security_corporation_org_admin",
			username: "ecoadmin@aressecuritycorp.com",
			integrations: [
				{
					config: {
						canView: true,
						role: "viewer"
					},
					entityType: "shapes",
					feedIcon: "Shapes",
					feedId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_shapes",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "fc979d32-a76a-4b24-a0cd-2de207fdf49b",
					intId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_shapes",
					isShareable: true,
					lastModifiedDate: "2022-09-28T07:13:04.460Z",
					metadata: {
						for: "integration server"
					},
					name: "Ares Security Corporation Shapes",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_shapes",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: ["manage"],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "app",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: [
									"entityData_properties_description",
									"entityData_properties_name",
									"entityData_properties_symbol",
									"isPublic",
									"entityData_properties_polyFill",
									"entityData_properties_polyStroke",
									"entityData_properties_polyFillOpacity",
									"entityData_properties_lineWidth",
									"entityData_properties_lineType"
								],
								initial: [
									"createdDate",
									"entityData_properties",
									"entityData_type",
									"entityType",
									"feedId",
									"id",
									"isPublic",
									"owner",
									"ownerOrg"
								],
								update: [
									"entityData_properties_description",
									"entityData_properties_name",
									"entityData_properties_symbol",
									"entityData_properties_type",
									"entityType",
									"feedId",
									"owner",
									"ownerOrg",
									"isPublic",
									"entityData_properties_polyFill",
									"entityData_properties_polyStroke",
									"entityData_properties_polyFillOpacity",
									"entityData_properties_lineWidth",
									"entityData_properties_lineType"
								]
							}
						},
						{
							alwaysSend: true,
							batch: "globalGeo",
							properties: {
								compare: [
									"entityData_geometry",
									"entityData_properties_name",
									"entityData_properties_symbol",
									"entityData_properties_polyFill",
									"entityData_properties_polyStroke",
									"entityData_properties_polyFillOpacity",
									"entityData_properties_lineWidth",
									"entityData_properties_lineType"
								],
								initial: [
									"entityData_geometry",
									"isPublic",
									"owner",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_symbol",
									"entityData_type",
									"entityData_properties_type",
									"entityData_properties_polyFill",
									"entityData_properties_polyStroke",
									"entityData_properties_polyFillOpacity",
									"entityData_properties_lineWidth",
									"entityData_properties_lineType",
									"feedId",
									"entityType"
								],
								update: [
									"entityData_geometry",
									"isPublic",
									"owner",
									"entityData_properties_name",
									"entityData_properties_symbol",
									"entityData_properties_polyFill",
									"entityData_properties_polyStroke",
									"entityData_properties_polyFillOpacity",
									"entityData_properties_lineWidth",
									"entityData_properties_lineType"
								]
							}
						}
					]
				},
				{
					config: {
						canView: true,
						role: "viewer"
					},
					entityType: "camera",
					feedIcon: "Camera",
					feedId: "aiv-cameras",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "d732a56e-3f70-4c98-8a1e-3372abe42feb",
					intId: "aiv-cameras",
					isShareable: true,
					lastModifiedDate: "2022-11-22T10:47:16.477Z",
					metadata: {
						for: "integration server"
					},
					name: "AIV Cameras",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_aiv_cameras",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: ["manage", "control"],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "app",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: [
									"entityData_properties_description",
									"entityData_properties_name",
									"fov",
									"isPublic",
									"entityData_displayTargetId",
									"entityData_displayType"
								],
								initial: [
									"entityData_properties_description",
									"entityData_properties_deviceType",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_type",
									"entityData_properties_id",
									"cameraSystem",
									"connection",
									"controls",
									"entityType",
									"feedId",
									"fov",
									"id",
									"isPublic",
									"owner",
									"ownerOrg",
									"video",
									"player",
									"entityData_displayTargetId",
									"entityData_displayType",
									"control"
								],
								update: [
									"entityData_properties_description",
									"entityData_properties_name",
									"fov",
									"owner",
									"isPublic",
									"feedId",
									"entityData_displayTargetId",
									"entityData_displayType"
								]
							}
						},
						{
							alwaysSend: true,
							batch: "globalGeo",
							properties: {
								compare: [
									"entityData_geometry",
									"spotlightShape",
									"entityData_displayTargetId",
									"entityData_displayType"
								],
								initial: [
									"entityData_geometry",
									"entityData_properties_id",
									"entityData_properties_name",
									"controls",
									"isPublic",
									"owner",
									"spotlightShape",
									"entityType",
									"entityData_displayTargetId",
									"entityData_displayType",
									"control",
									"entityData_properties_type",
									"feedId"
								],
								update: [
									"entityData_geometry",
									"isPublic",
									"owner",
									"spotlightShape",
									"entityData_displayTargetId",
									"entityData_displayType"
								]
							}
						}
					]
				},
				{
					config: {
						canView: true,
						role: "viewer"
					},
					desc: "Search vigilant lpr detections in an offset window from current time",
					entityType: "on-demand",
					externalSystemId: "vigilant-detection",
					feedIcon: "OnDemand",
					feedId: "vigilant-detection",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "ec89a04b-3ff3-4412-80f4-3b0451c17dff",
					intId: "vigilant-detection",
					isShareable: true,
					lastModifiedDate: "2022-11-22T10:47:21.180Z",
					metadata: {
						for: "integration server"
					},
					name: "Vigilant Detection Search",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_vigilant-detection",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: [],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "app",
					streamProperties: null
				},
				{
					config: {
						canView: true,
						role: "viewer"
					},
					entityType: "list",
					feedIcon: "Lists",
					feedId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_lists",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "0188ddd1-640e-4951-a7a5-1b8bd9946102",
					intId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_lists",
					isShareable: true,
					lastModifiedDate: "2022-10-27T06:26:53.036Z",
					metadata: {
						for: "integration server"
					},
					name: "Ares Security Corporation Lists",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_lists",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: ["manage"],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "app",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: [
									"category",
									"name",
									"isPublic",
									"columns",
									"rows",
									"noPagination",
									"index",
									"generateActivities"
								],
								initial: [
									"createdDate",
									"category",
									"columns",
									"targetType",
									"targetId",
									"name",
									"feedId",
									"id",
									"isPublic",
									"owner",
									"ownerOrg",
									"rows",
									"noPagination",
									"index",
									"generateActivities"
								],
								update: [
									"name",
									"columns",
									"category",
									"feedId",
									"owner",
									"ownerOrg",
									"isPublic",
									"rows",
									"noPagination",
									"index",
									"generateActivities"
								]
							}
						}
					]
				},
				{
					config: {
						canView: true,
						role: "viewer"
					},
					displayProperties: [
						{
							key: "length",
							label: "Length",
							unit: "m"
						},
						{
							key: "width",
							label: "Width",
							unit: "m"
						},
						{
							key: "callsign",
							label: "Call Sign"
						},
						{
							key: "destination",
							label: "Destination"
						},
						{
							key: "draught",
							label: "Draft",
							unit: "m"
						},
						{
							key: "imo",
							label: "IMO"
						},
						{
							key: "mmsi",
							label: "MMSI"
						},
						{
							key: "navstatusname",
							label: "Navigation Status"
						},
						{
							key: "timestamp",
							label: "Last Updated",
							unit: "time"
						},
						{
							key: "countryCode",
							label: "Country",
							tooltip: "countryOfOrigin",
							visual: "flag"
						},
						{
							key: "course",
							label: "Course",
							unit: "°",
							visual: "direction"
						},
						{
							key: "speed",
							label: "Speed",
							unit: "kn",
							visual: "text"
						}
					],
					entityType: "track",
					feedIcon: "Track",
					feedId: "aishub",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "3dc30971-46f0-477f-8c82-ddd5080bc00d",
					intId: "aishub",
					isShareable: false,
					lastModifiedDate: "2022-10-14T10:33:39.617Z",
					mapIconTemplate: "properties.(iconType & '_' & disposition)",
					metadata: {
						for: "integration server"
					},
					name: "AISHUB",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_aishub",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046a",
					permissions: [],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "int",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: ["entityData_properties_disposition", "entityData_properties_name"],
								initial: [
									"entityData_properties_disposition",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_imo",
									"entityData_properties_mmsi",
									"entityData_properties_callsign",
									"entityData_properties_type",
									"entityData_properties_id",
									"entityType",
									"feedId",
									"ownerOrg",
									"sourceId",
									"isPublic"
								],
								update: [
									"entityData_properties_disposition",
									"entityData_properties_name",
									"isPublic",
									"sourceId",
									"feedId"
								]
							}
						},
						{
							alwaysSend: true,
							batch: "globalGeo",
							properties: {
								compare: [
									"entityData_geometry",
									"entityData_properties_course",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_dimA",
									"entityData_properties_dimB",
									"entityData_properties_dimC",
									"entityData_properties_dimD",
									"entityData_properties_hdg",
									"entityData_properties_heading",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition"
								],
								initial: [
									"entityData_geometry",
									"entityData_properties_course",
									"feedId",
									"isPublic",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_dimA",
									"entityData_properties_dimB",
									"entityData_properties_dimC",
									"entityData_properties_dimD",
									"entityData_properties_hdg",
									"entityData_properties_heading",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition",
									"entityType",
									"entityData_properties_type"
								],
								update: [
									"entityData_geometry",
									"entityData_properties_course",
									"isPublic",
									"feedId",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_dimA",
									"entityData_properties_dimB",
									"entityData_properties_dimC",
									"entityData_properties_dimD",
									"entityData_properties_hdg",
									"entityData_properties_heading",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition"
								]
							}
						}
					],
					ttl: 600
				},
				{
					config: {
						canView: true,
						role: "viewer"
					},
					entityType: "accessPoint",
					feedIcon: "accessPoint",
					feedId: "accessPoint",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "47a42c31-53c4-483e-8726-5c4c59a7fc45",
					intId: "accessPoint",
					isShareable: true,
					lastModifiedDate: "2022-09-28T09:27:59.603Z",
					mapIconTemplate:
						"'Sensor_' & (properties.antennaRpm ? properties.antennaRpm < 10 ? 'red' : 'green' : 'gray')",
					metadata: {
						for: "integration server"
					},
					name: "Access Point",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_accessPoint",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: ["manage", "control"],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "app",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: [
									"entityData_properties_description",
									"entityData_properties_name",
									"fov",
									"isPublic",
									"entityData_displayTargetId",
									"entityData_displayType"
								],
								initial: [
									"entityData_properties_description",
									"entityData_properties_deviceType",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_type",
									"entityData_properties_id",
									"cameraSystem",
									"connection",
									"controls",
									"entityType",
									"feedId",
									"fov",
									"id",
									"isPublic",
									"owner",
									"ownerOrg",
									"video",
									"player",
									"entityData_displayTargetId",
									"entityData_displayType",
									"control"
								],
								update: [
									"entityData_properties_description",
									"entityData_properties_name",
									"fov",
									"owner",
									"isPublic",
									"feedId",
									"entityData_displayTargetId",
									"entityData_displayType"
								]
							}
						},
						{
							alwaysSend: true,
							batch: "globalGeo",
							properties: {
								compare: [
									"entityData_geometry",
									"spotlightShape",
									"entityData_displayTargetId",
									"entityData_displayType"
								],
								initial: [
									"entityData_geometry",
									"entityData_properties_id",
									"entityData_properties_name",
									"controls",
									"isPublic",
									"owner",
									"spotlightShape",
									"entityType",
									"entityData_displayTargetId",
									"entityData_displayType",
									"control",
									"entityData_properties_type",
									"feedId"
								],
								update: [
									"entityData_geometry",
									"isPublic",
									"owner",
									"spotlightShape",
									"entityData_displayTargetId",
									"entityData_displayType"
								]
							}
						}
					]
				},
				{
					config: {
						canView: true,
						role: "viewer"
					},
					entityType: "camera",
					feedIcon: "Camera",
					feedId: "cameras",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "807ad39a-a0ef-4806-85b3-4e78132761c9",
					intId: "cameras",
					isShareable: true,
					lastModifiedDate: "2022-09-28T07:13:04.460Z",
					metadata: {
						for: "integration server"
					},
					name: "Cameras",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_cameras",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: ["manage", "control"],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "app",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: [
									"entityData_properties_description",
									"entityData_properties_name",
									"fov",
									"isPublic",
									"entityData_displayTargetId",
									"entityData_displayType"
								],
								initial: [
									"entityData_properties_description",
									"entityData_properties_deviceType",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_type",
									"entityData_properties_id",
									"cameraSystem",
									"connection",
									"controls",
									"entityType",
									"feedId",
									"fov",
									"id",
									"isPublic",
									"owner",
									"ownerOrg",
									"video",
									"player",
									"entityData_displayTargetId",
									"entityData_displayType",
									"control"
								],
								update: [
									"entityData_properties_description",
									"entityData_properties_name",
									"fov",
									"owner",
									"isPublic",
									"feedId",
									"entityData_displayTargetId",
									"entityData_displayType"
								]
							}
						},
						{
							alwaysSend: true,
							batch: "globalGeo",
							properties: {
								compare: [
									"entityData_geometry",
									"spotlightShape",
									"entityData_displayTargetId",
									"entityData_displayType"
								],
								initial: [
									"entityData_geometry",
									"entityData_properties_id",
									"entityData_properties_name",
									"controls",
									"isPublic",
									"owner",
									"spotlightShape",
									"entityType",
									"entityData_displayTargetId",
									"entityData_displayType",
									"control",
									"entityData_properties_type",
									"feedId"
								],
								update: [
									"entityData_geometry",
									"isPublic",
									"owner",
									"spotlightShape",
									"entityData_displayTargetId",
									"entityData_displayType"
								]
							}
						}
					]
				},
				{
					config: {
						canView: true,
						role: "viewer"
					},
					entityType: "facility",
					feedIcon: "Facilities",
					feedId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_facilities",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "8305388e-4126-4faa-9889-47411c633644",
					intId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_facilities",
					isShareable: true,
					lastModifiedDate: "2022-09-28T07:13:04.460Z",
					metadata: {
						for: "integration server"
					},
					name: "Ares Security Corporation Facilities",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_facilities",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: ["manage"],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "app",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: [
									"entityData_properties_description",
									"entityData_properties_name",
									"isPublic"
								],
								initial: [
									"createdDate",
									"entityData_properties",
									"entityType",
									"feedId",
									"id",
									"isPublic",
									"owner",
									"ownerOrg"
								],
								update: [
									"entityData_properties_description",
									"entityData_properties_name",
									"entityData_properties_type",
									"entityType",
									"feedId",
									"owner",
									"ownerOrg",
									"isPublic"
								]
							}
						},
						{
							alwaysSend: true,
							batch: "globalGeo",
							properties: {
								compare: ["entityData_geometry", "entityData_properties_name"],
								initial: [
									"entityData_geometry",
									"isPublic",
									"owner",
									"feedId",
									"entityData_properties_name",
									"entityData_properties_id",
									"entityData_properties_type",
									"entityType"
								],
								update: [
									"entityData_geometry",
									"isPublic",
									"owner",
									"feedId",
									"entityData_properties_name"
								]
							}
						}
					],
					widgets: [
						{
							defaultPriority: 5,
							id: "facility-condition",
							priorityOptions: [
								{
									label: "1",
									value: 1
								},
								{
									label: "2",
									value: 2
								},
								{
									label: "3",
									value: 3
								},
								{
									label: "4",
									value: 4
								},
								{
									label: "5",
									value: 5
								}
							]
						}
					]
				},
				{
					appId: "vessels-app",
					config: {
						canView: true,
						role: "viewer"
					},
					displayProperties: [
						{
							key: "length",
							label: "Length",
							unit: "m"
						},
						{
							key: "width",
							label: "Width",
							unit: "m"
						},
						{
							key: "callsign",
							label: "Call Sign"
						},
						{
							key: "destination",
							label: "Destination"
						},
						{
							key: "draught",
							label: "Draft",
							unit: "m"
						},
						{
							key: "imo",
							label: "IMO"
						},
						{
							key: "mmsi",
							label: "MMSI"
						},
						{
							key: "navstatusname",
							label: "Navigation Status"
						},
						{
							key: "timestamp",
							label: "Last Updated",
							unit: "time"
						},
						{
							key: "countryCode",
							label: "Country",
							tooltip: "countryOfOrigin",
							visual: "flag"
						},
						{
							key: "course",
							label: "Course",
							unit: "°",
							visual: "direction"
						},
						{
							key: "speed",
							label: "Speed",
							unit: "kn",
							visual: "text"
						}
					],
					entityType: "track",
					feedIcon: "Track",
					feedId: "fake-atak",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "29579855-73a4-4b8a-aff9-5299289af02d",
					intId: "fake-atak",
					isShareable: false,
					lastModifiedDate: "2022-12-13T19:44:03.499Z",
					mapIconTemplate:
						"$exists(properties.speed) ? ('vessel_big_' & (properties.(speed < 4) ? 'unknown' : (properties.(speed >= 4 and speed < 10) ? 'friendly' : 'hostile'))) : properties.(iconType & '_' & disposition)",
					marineTrafficVisible: false,
					metadata: {
						for: "integration server"
					},
					name: "Fake ATAK",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_fake-atak",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: [],
					policy: {
						type: "owner"
					},
					profileIconTemplate:
						"$exists(properties.speed) ? (properties.(speed < 4) ? 'place' : (properties.(speed >= 4 and speed < 10) ? 'layers' : 'timeline')) : 'videocam'",
					renderSilhouette: true,
					roleId: "ares_security_corporation_org_admin",
					source: "int",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: [
									"entityData_properties_disposition",
									"entityData_properties_name",
									"entityData_properties_speed"
								],
								initial: [
									"entityData_properties_disposition",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_imo",
									"entityData_properties_mmsi",
									"entityData_properties_callsign",
									"entityData_properties_type",
									"entityData_properties_id",
									"entityType",
									"feedId",
									"ownerOrg",
									"sourceId",
									"isPublic",
									"entityData_properties_speed"
								],
								update: [
									"entityData_properties_disposition",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_id",
									"entityType",
									"isPublic",
									"sourceId",
									"feedId",
									"entityData_properties_speed",
									"entityData_properties_type"
								]
							}
						},
						{
							alwaysSend: false,
							batch: "globalGeo",
							properties: {
								compare: [
									"entityData_geometry",
									"entityData_properties_course",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_dimA",
									"entityData_properties_dimB",
									"entityData_properties_dimC",
									"entityData_properties_dimD",
									"entityData_properties_hdg",
									"entityData_properties_heading",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition",
									"entityData_properties_speed"
								],
								initial: [
									"entityData_geometry",
									"entityData_properties_course",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_dimA",
									"entityData_properties_dimB",
									"entityData_properties_dimC",
									"entityData_properties_dimD",
									"entityData_properties_hdg",
									"entityData_properties_heading",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition",
									"entityType",
									"entityData_properties_type",
									"entityData_properties_speed",
									"feedId"
								],
								update: [
									"entityData_geometry",
									"entityData_properties_course",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_dimA",
									"entityData_properties_dimB",
									"entityData_properties_dimC",
									"entityData_properties_dimD",
									"entityData_properties_hdg",
									"entityData_properties_heading",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition",
									"entityData_properties_speed",
									"entityData_properties_type",
									"entityType",
									"feedId"
								]
							}
						}
					]
				},
				{
					config: {
						canView: true,
						role: "viewer"
					},
					displayProperties: [
						{
							key: "length",
							label: "Length",
							unit: "m"
						},
						{
							key: "width",
							label: "Width",
							unit: "m"
						},
						{
							key: "destination",
							label: "Destination"
						},
						{
							key: "navstatusname",
							label: "Navigation Status"
						},
						{
							key: "timestamp",
							label: "Last Updated",
							unit: "time"
						},
						{
							key: "course",
							label: "Course",
							unit: "°",
							visual: "direction"
						},
						{
							key: "speed",
							label: "Speed",
							unit: "kn",
							visual: "text"
						}
					],
					entityType: "track",
					feedIcon: "Drone",
					feedId: "whitefox_drone",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "3dc30971-46f0-477f-8c82-ddd5080bc00e",
					intId: "whitefox_drone",
					isShareable: false,
					lastModifiedDate: "2022-10-20T10:51:56.954Z",
					mapIconTemplate: "properties.(iconType & '_' & disposition)",
					metadata: {
						for: "integration server"
					},
					name: "White Fox Drone",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_whitefox_drone",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: [],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "int",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: ["entityData_properties_disposition", "entityData_properties_name"],
								initial: [
									"entityData_properties_disposition",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_flightId",
									"entityData_properties_type",
									"entityData_properties_id",
									"entityType",
									"feedId",
									"ownerOrg",
									"sourceId",
									"isPublic"
								],
								update: [
									"entityData_properties_disposition",
									"entityData_properties_name",
									"isPublic",
									"sourceId",
									"feedId"
								]
							}
						},
						{
							alwaysSend: true,
							batch: "globalGeo",
							properties: {
								compare: [
									"entityData_geometry",
									"entityData_properties_course",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_heading",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition",
									"entityData_properties_flightId"
								],
								initial: [
									"entityData_geometry",
									"entityData_properties_course",
									"feedId",
									"isPublic",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_heading",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition",
									"entityType",
									"entityData_properties_type",
									"entityData_properties_flightId"
								],
								update: [
									"entityData_geometry",
									"entityData_properties_course",
									"isPublic",
									"feedId",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_heading",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition"
								]
							}
						}
					],
					ttl: 600,
					widgets: [
						{
							id: "drone-association"
						}
					]
				},
				{
					appId: "vessels-app",
					config: {
						canView: true,
						role: "viewer"
					},
					displayProperties: [
						{
							key: "length",
							label: "Length",
							unit: "m"
						},
						{
							key: "width",
							label: "Width",
							unit: "m"
						},
						{
							key: "callsign",
							label: "Call Sign"
						},
						{
							key: "destination",
							label: "Destination"
						},
						{
							key: "draught",
							label: "Draft",
							unit: "m"
						},
						{
							key: "imo",
							label: "IMO"
						},
						{
							key: "mmsi",
							label: "MMSI"
						},
						{
							key: "navstatusname",
							label: "Navigation Status"
						},
						{
							key: "timestamp",
							label: "Last Updated",
							unit: "time"
						},
						{
							key: "countryCode",
							label: "Country",
							tooltip: "countryOfOrigin",
							visual: "flag"
						},
						{
							key: "course",
							label: "Course",
							unit: "°",
							visual: "direction"
						},
						{
							key: "speed",
							label: "Speed",
							unit: "kn",
							visual: "text"
						}
					],
					entityType: "track",
					feedIcon: "Track",
					feedId: "fake-atak",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "29579855-73a4-4b8a-aff9-5299289af02d",
					intId: "fake-atak",
					isShareable: false,
					lastModifiedDate: "2022-12-15T12:36:57.911Z",
					mapIconTemplate:
						"$exists(properties.speed) ? ('vessel_big_' & (properties.(speed < 4) ? 'unknown' : (properties.(speed >= 4 and speed < 10) ? 'friendly' : 'hostile'))) : properties.(iconType & '_' & disposition)",
					marineTrafficVisible: false,
					metadata: {
						for: "integration server"
					},
					name: "Fake ATAK",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_fake-atak",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: [],
					policy: {
						type: "owner"
					},
					profileIconTemplate:
						"$exists(properties.speed) ? (properties.(speed < 4) ? 'place' : (properties.(speed >= 4 and speed < 10) ? 'layers' : 'timeline')) : 'videocam'",
					renderSilhouette: true,
					roleId: "ares_security_corporation_org_admin",
					source: "int",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: [
									"entityData_properties_disposition",
									"entityData_properties_name",
									"entityData_properties_speed"
								],
								initial: [
									"entityData_properties_disposition",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_imo",
									"entityData_properties_mmsi",
									"entityData_properties_callsign",
									"entityData_properties_type",
									"entityData_properties_id",
									"entityType",
									"feedId",
									"ownerOrg",
									"sourceId",
									"isPublic",
									"entityData_properties_speed"
								],
								update: [
									"entityData_properties_disposition",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_id",
									"entityType",
									"isPublic",
									"sourceId",
									"feedId",
									"entityData_properties_speed",
									"entityData_properties_type"
								]
							}
						},
						{
							alwaysSend: false,
							batch: "globalGeo",
							properties: {
								compare: [
									"entityData_geometry",
									"entityData_properties_course",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_dimA",
									"entityData_properties_dimB",
									"entityData_properties_dimC",
									"entityData_properties_dimD",
									"entityData_properties_hdg",
									"entityData_properties_heading",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition",
									"entityData_properties_speed"
								],
								initial: [
									"entityData_geometry",
									"entityData_properties_course",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_dimA",
									"entityData_properties_dimB",
									"entityData_properties_dimC",
									"entityData_properties_dimD",
									"entityData_properties_hdg",
									"entityData_properties_heading",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition",
									"entityType",
									"entityData_properties_type",
									"entityData_properties_speed",
									"feedId"
								],
								update: [
									"entityData_geometry",
									"entityData_properties_course",
									"entityData_properties_length",
									"entityData_properties_width",
									"entityData_properties_dimA",
									"entityData_properties_dimB",
									"entityData_properties_dimC",
									"entityData_properties_dimD",
									"entityData_properties_hdg",
									"entityData_properties_heading",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_iconType",
									"entityData_properties_disposition",
									"entityData_properties_speed",
									"entityData_properties_type",
									"entityType",
									"feedId"
								]
							}
						}
					]
				},
				{
					config: {
						canView: true,
						role: "viewer"
					},
					entityType: "accessPoint",
					feedIcon: "Access point",
					feedId: "ssr-radars",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "bd6bbfda-d18e-42a7-9716-1a92a55cf702",
					intId: "ssr-radars",
					isShareable: true,
					lastModifiedDate: "2022-09-28T13:47:12.090Z",
					mapIconTemplate:
						"'Sensor_' & (properties.antennaRpm ? (properties.antennaRpm < 10 ? 'red' : 'green') : 'gray')",
					metadata: {
						for: "integration server"
					},
					name: "SSR Radars",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_ssr_radars",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: ["control", "manage"],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "app",
					streamProperties: [
						{
							alwaysSend: false,
							batch: "globalData",
							properties: {
								compare: [
									"entityData_properties_description",
									"entityData_properties_name",
									"fov",
									"isPublic",
									"entityData_displayTargetId",
									"entityData_displayType"
								],
								initial: [
									"entityData_properties_description",
									"entityData_properties_deviceType",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_type",
									"entityData_properties_id",
									"cameraSystem",
									"connection",
									"controls",
									"entityType",
									"feedId",
									"fov",
									"id",
									"isPublic",
									"owner",
									"ownerOrg",
									"video",
									"player",
									"entityData_displayTargetId",
									"entityData_displayType",
									"control"
								],
								update: [
									"entityData_properties_description",
									"entityData_properties_name",
									"fov",
									"owner",
									"isPublic",
									"feedId",
									"entityData_displayTargetId",
									"entityData_displayType"
								]
							}
						},
						{
							alwaysSend: true,
							batch: "globalGeo",
							properties: {
								compare: [
									"entityData_geometry",
									"spotlightShape",
									"entityData_displayTargetId",
									"entityData_displayType"
								],
								initial: [
									"entityData_geometry",
									"entityData_properties_id",
									"entityData_properties_name",
									"entityData_properties_antennaRpm",
									"controls",
									"isPublic",
									"owner",
									"spotlightShape",
									"entityType",
									"entityData_displayTargetId",
									"entityData_displayType",
									"control",
									"entityData_properties_type",
									"feedId"
								],
								update: [
									"entityData_geometry",
									"isPublic",
									"owner",
									"spotlightShape",
									"entityData_displayTargetId",
									"entityData_displayType"
								]
							}
						}
					]
				},
				{
					config: {
						canView: true,
						role: "viewer"
					},
					entityType: "track",
					feedIcon: "Track",
					feedId: "track-generator",
					feedOwnerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					id: "9cc64849-deb4-4e04-9997-d4030a0a0999",
					intId: "track-generator",
					isShareable: false,
					lastModifiedDate: "2022-10-14T04:21:45.363Z",
					mapIconTemplate: "properties.(iconType & '_' & disposition)",
					metadata: {
						for: "integration server"
					},
					name: "Test Track Feed",
					orgIntId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_track-generator",
					ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
					permissions: [],
					policy: {
						type: "owner"
					},
					roleId: "ares_security_corporation_org_admin",
					source: "int",
					ttl: 60
				}
			]
		},
		sessionEnded: false,
		firstUseText: ""
	},
	userFeeds: {
		"ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_shapes": {
			feedId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_shapes",
			name: "Ares Security Corporation Shapes",
			canView: true,
			source: "app",
			entityType: "shapes",
			ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			marineTrafficVisible: false
		},
		"ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_facilities": {
			feedId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b_facilities",
			name: "Ares Security Corporation Facilities",
			canView: true,
			source: "app",
			entityType: "facility",
			ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			marineTrafficVisible: false
		},
		accessPoint: {
			feedId: "accessPoint",
			name: "Access Point",
			canView: true,
			source: "app",
			entityType: "accessPoint",
			ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			mapIconTemplate:
				"'Sensor_' & (properties.antennaRpm ? properties.antennaRpm < 10 ? 'red' : 'green' : 'gray')",
			marineTrafficVisible: false
		},
		"aiv-cameras": {
			feedId: "aiv-cameras",
			name: "AIV Cameras",
			canView: true,
			source: "app",
			entityType: "camera",
			ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			marineTrafficVisible: false
		},
		"track-generator": {
			feedId: "track-generator",
			name: "Test Track Feed",
			canView: true,
			source: "int",
			entityType: "track",
			ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			mapIconTemplate: "properties.(iconType & '_' & disposition)",
			marineTrafficVisible: false
		},
		aishub: {
			feedId: "aishub",
			name: "AISHUB",
			canView: true,
			source: "int",
			entityType: "track",
			ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046a",
			mapIconTemplate: "properties.(iconType & '_' & disposition)",
			marineTrafficVisible: false
		},
		cameras: {
			feedId: "cameras",
			name: "Cameras",
			canView: true,
			source: "app",
			entityType: "camera",
			ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			marineTrafficVisible: false
		},
		whitefox_drone: {
			feedId: "whitefox_drone",
			name: "White Fox Drone",
			canView: true,
			source: "int",
			entityType: "track",
			ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			mapIconTemplate: "properties.(iconType & '_' & disposition)",
			marineTrafficVisible: false
		},
		"fake-atak": {
			feedId: "fake-atak",
			name: "Fake ATAK",
			canView: true,
			source: "int",
			entityType: "track",
			ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			mapIconTemplate:
				"$exists(properties.speed) ? ('vessel_big_' & (properties.(speed < 4) ? 'unknown' : (properties.(speed >= 4 and speed < 10) ? 'friendly' : 'hostile'))) : properties.(iconType & '_' & disposition)",
			profileIconTemplate:
				"$exists(properties.speed) ? (properties.(speed < 4) ? 'place' : (properties.(speed >= 4 and speed < 10) ? 'layers' : 'timeline')) : 'videocam'",
			renderSilhouette: true,
			marineTrafficVisible: false
		},
		"ssr-radars": {
			feedId: "ssr-radars",
			name: "SSR Radars",
			canView: true,
			source: "app",
			entityType: "accessPoint",
			ownerOrg: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			mapIconTemplate:
				"'Sensor_' & (properties.antennaRpm ? (properties.antennaRpm < 10 ? 'red' : 'green') : 'gray')",
			marineTrafficVisible: false
		}
	},
	organization: {
		isHydrated: true,
		profile: {
			authProviderId: "system",
			description: "Worldwide leader in situational awareness.",
			id: "958338df-c3b8-4f88-98a7-c9846fd34e74",
			lastModifiedDate: "2022-09-30T05:18:35.062Z",
			maxSharingConnections: 2,
			name: "Ares Security Corporation",
			orgId: "ares_security_corporation_8204d8e0-acde-4887-814f-13d3e7de046b",
			supportURL: "http://aressecuritycorp.com/contact/"
		},
		externalSystems: ["ssr-radars", "vigilant-detection", "aiv-detection"]
	}
};

export { session };
