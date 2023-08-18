import moment from "moment";

export const fromDay = (date, n) => {
	let newDate;
	if (n < 0) {
		newDate = moment(date).subtract(Math.abs(n), "d");
	} else {
		newDate = moment(date).add(n, "d");
	}
	return newDate.set({ hour: 0, minute: 0, second: 0 }).valueOf();
};

export const parseData = data => {
	const { schedule, vessel, footmark } = data;
	const { loa, id } = vessel;
	const { ata, atd, eta, etd } = schedule;
	const x0 = moment(ata || eta).valueOf();
	const x = moment(atd || etd).valueOf();

	const retval = [
		{
			key: id,
			x0,
			y0: footmark,
			x,
			y: footmark + loa,
			assignment: data
		}
	];
	return retval;
};

export const getShapeData = data => {
	const { schedule, vessel, footmark, footmarkAssignment } = data;
	const { loa } = vessel;
	const { ata, eta } = schedule;
	const top = footmark + loa - 12;
	const bottom = footmark + 12;
	const arrival = moment(ata || eta);
	const left = arrival.add(50, "m").valueOf();	// offset 50
	const center = arrival.add(50, "m").valueOf();	// offset 100
	const right = arrival.add(50, "m").valueOf();	// offset 150
	return footmarkAssignment === "stern"
		? [
			{ x: center, y: top },
			{ x: left, y: top - 60 },
			{ x: left, y: bottom },
			{ x: right, y: bottom },
			{ x: right, y: top - 60 }
		]
		: [
			{ x: left, y: top },
			{ x: left, y: bottom + 60 },
			{ x: center, y: bottom },
			{ x: right, y: bottom + 60 },
			{ x: right, y: top }
		];
};

export const getPrimaryLabels = data => {
	const labels = data.map(d => {
		const { schedule, vessel, footmark } = d;
		const { loa, name } = vessel;
		const { ata, eta } = schedule;
		return {
			x: moment(ata || eta)
				.add(360, "m")
				.valueOf(),
			yOffset: 0,
			y: footmark + loa / 2,
			label: name
		};
	});
	return labels;
};

export const getSecondaryLabels = data => {
	const labels = data.map(d => {
		const { schedule, vessel, footmark } = d;
		const { loa } = vessel;
		const { ata, eta } = schedule;
		return {
			x: moment(ata || eta)
				.add(360, "m")
				.valueOf(),
			yOffset: 16,
			y: footmark + loa / 2,
			label: `${loa}'`
		};
	});
	return labels;
};

export const getPendingPrimaryLabels = data => {
	const labels = data.map(d => {
		const { offset, schedule, vessel } = d;
		const { name } = vessel;
		const { ata, eta } = schedule;
		return {
			x: moment(ata || eta)
				.add(75, "m")
				.valueOf(),
			yOffset: 25,
			y: 60 + 50 * offset,
			label: name
		};
	});
	return labels;
};

export const getPendingSecondaryLabels = data => {
	const labels = data.map(d => {
		const { offset, schedule, vessel } = d;
		const { loa } = vessel;
		const { ata, eta } = schedule;
		return {
			x: moment(ata || eta)
				.add(75, "m")
				.valueOf(),
			yOffset: 43,
			y: 60 + 50 * offset,
			label: `${loa}'`
		};
	});
	return labels;
};

export const getTimeSpan = date => {
	return [fromDay(date, -1), fromDay(date, 6)];
};

export const getTimeGrid = date => {
	const scale = [-2, -1, 0, 1, 2, 3, 4, 5];
	const range = scale.map(n => fromDay(date, n));
	return range;
};
