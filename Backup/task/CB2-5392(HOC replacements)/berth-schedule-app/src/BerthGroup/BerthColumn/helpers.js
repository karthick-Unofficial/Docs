import React from "react";

export const parseBerthData = data => {
	const parsedData = data.map(d => {
		const { beginningFootmark, endFootmark } = d;
		return {
			y0: beginningFootmark,
			y: endFootmark,
			x0: 0,
			x: 100
		};
	});
	return parsedData;
};

export const getPrimaryLabels = data => {
	const labelData = data.map(d => {
		const { endFootmark, name } = d;
		return {
			yOffset: 24,
			y: endFootmark,
			x: 8,
			label: name,
			berth: d
		};
	});
	return labelData;
};
export const getSecondaryLabels = data => {
	const labelData = data.map(d => {
		const { endFootmark, beginningFootmark } = d;
		return {
			yOffset: 44,
			y: endFootmark,
			x: 8,
			label: `${endFootmark - beginningFootmark}'`,
			style: { fontSize: 14 }
		};
	});
	return labelData;
};

export const handleTickFormat = (v, berths) => {
	const lastBerth = berths[berths.length - 1];
	const footMarks = [
		...berths.map(berth => berth.beginningFootmark),
		...berths.map(berth => berth.endFootmark)
	];
	if (footMarks.includes(v)) {
		return (
			<g>
				{v !== lastBerth.endFootmark && (
					<text
						fontSize={12}
						transform={`translate(${-40 +
							6.72 * (4 - v.toString().length)}, -10)`}
						style={{ fill: "#B5B9BE", stroke: "transparent" }}
					>
						{v}
					</text>
				)}
				<text
					fontSize={12}
					transform={`translate(${-40 + 6.72 * (4 - v.toString().length)}, 20)`}
					style={{ fill: "#B5B9BE", stroke: "transparent" }}
				>
					{v}
				</text>
			</g>
		);
	}
};

export const getIncrements = berths => {
	const lastBerth = berths[berths.length - 1];
	const increments = [];
	for (let index = 0; index < lastBerth.endFootmark; index += 100) {
		increments.push(index);
	}
	return increments;
};
