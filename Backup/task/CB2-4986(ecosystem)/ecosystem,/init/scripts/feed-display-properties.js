const provider = require("../../lib/rethinkdbProvider");
const config = require("../../config");
const r = provider.r;
const DISPLAY_PROPERTIES = [
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
];

module.exports.applyScript = async function() {
	const scriptName = "feed-display-properties";

	try {
		const feedTypes = await r.table("sys_feedTypes");
		// Update AISHUB and SSR properties
		if (feedTypes.length > 0) {
			await r
				.table("sys_feedTypes")
				.filter(r.or(r.row("feedId").eq("aishub"), r.row("feedId").eq("ssr")))
				.update({ displayProperties: DISPLAY_PROPERTIES })
				.run();

			// Grab other feed types
			const data = await r
				.table("sys_feedTypes")
				.filter(r.and(r.row("feedId").ne("aishub"), r.row("feedId").ne("ssr")))
				.run();

			// Transform any display properties into a basic object with a key and label
			for (let i = 0; i < data.length; i++) {
				const feedType = data[i];
				const { displayProperties, id } = feedType;
				const processProps = async properties => {
					const newProps = [];
					for (const key in properties) {
						await newProps.push({ key: key, label: properties[key] });
					}
					return newProps;
				};
				if (displayProperties) {
					const newProps = await processProps(displayProperties);
					await r
						.table("sys_feedTypes")
						.get(id)
						.update({ displayProperties: newProps })
						.run();
				}
			}
		}

		return { success: true };
	} catch (err) {
		console.log(`There was an error with the ${scriptName} script:`, err);
		return { success: false, err };
	}
};
