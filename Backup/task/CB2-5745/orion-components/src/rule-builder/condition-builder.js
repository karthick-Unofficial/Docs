import React from "react";
import moment from "moment-timezone";
import { timeConversion } from "client-app-core";
import find from "lodash/find";
import { getTranslation } from "orion-components/i18n";

const getConditions = (rule, collections) => {
	if (rule.conditions.length === 0) {
		return "";
	} else {
		let andString = "";
		const timeFormatPreference = rule.timeFormatPreference
			? rule.timeFormatPreference
			: "12-hour";

		// Render conditions portion of rule statement
		const conditions = rule.conditions.map((cond) => {
			switch (cond.type) {
				case "time": {
					const startTime = moment.utc(cond.startTime, "h:mm A");
					const endTime = moment.utc(cond.endTime, "h:mm A");

					const timeFormat =
						timeFormatPreference === "24-hour"
							? "H:mm z"
							: "h:mm A z";
					const startTimeTZ = timeConversion.convertToUserTime(
						startTime,
						timeFormat
					);
					const endTimeTZ = timeConversion.convertToUserTime(
						endTime,
						timeFormat
					);

					let finalString = "";

					if (cond.anyTimeOfDay) {
						finalString += "";
					} else {
						finalString += getTranslation(
							"global.ruleBuilder.conditionBuilder.betweenValues",
							"",
							startTimeTZ,
							endTimeTZ
						);
					}

					if (cond.weekdays.length === 7) {
						finalString += "";
					} else {
						if (finalString.length === 0) {
							finalString += getTranslation(
								"global.ruleBuilder.conditionBuilder.itIs"
							);
						}
						const days = [
							"Sunday",
							"Monday",
							"Tuesday",
							"Wednesday",
							"Thursday",
							"Friday",
							"Saturday"
						];
						finalString += cond.weekdays
							.map(
								(index, i) =>
									(i === cond.weekdays.length && i > 1
										? getTranslation(
												"global.ruleBuilder.conditionBuilder.or"
										  )
										: " ") +
									getTranslation(
										`global.ruleBuilder.conditionBuilder.${days[index]}`
									)
							)
							.join(",");
					}

					if (cond.indefinite) {
						finalString += "";
					} else {
						const startDate = timeConversion.convertToUserTime(
							cond.startDate,
							"ll"
						);
						const endDate = timeConversion.convertToUserTime(
							cond.endDate,
							"ll"
						);
						if (
							cond.weekdays.length &&
							cond.weekdays.length !== 7
						) {
							finalString += getTranslation(
								"global.ruleBuilder.conditionBuilder.and"
							);
						}
						finalString +=
							startDate === endDate
								? getTranslation(
										"global.ruleBuilder.conditionBuilder.dateIs",
										startDate
								  )
								: getTranslation(
										"global.ruleBuilder.conditionBuilder.duringPeriod",
										"",
										startDate,
										endDate
								  );
					}

					finalString += "";
					andString = getTranslation(
						"global.ruleBuilder.conditionBuilder.and"
					);
					return finalString;
				}
				case "speed": {
					const conditions = [];
					if (cond.minSpeed) {
						const minSpeed = getTranslation(
							"global.ruleBuilder.conditionBuilder.travelingSlower",
							"",
							cond.minSpeed,
							cond.unit
						);
						conditions.push(minSpeed);
					}
					if (cond.maxSpeed) {
						const maxSpeed = getTranslation(
							"global.ruleBuilder.conditionBuilder.travelingFaster",
							"",
							cond.maxSpeed,
							cond.unit
						);
						conditions.push(maxSpeed);
					}
					andString = getTranslation(
						"global.ruleBuilder.conditionBuilder.and"
					);
					return conditions.join(
						getTranslation("global.ruleBuilder.conditionBuilder.or")
					);
				}

				case "in-collection": {
					const collection = find(
						collections,
						(col) => col.id === cond.id
					);
					if (!collection) {
						return "";
					}
					const collectionName = collection.name;
					andString = getTranslation(
						"global.ruleBuilder.conditionBuilder.and"
					);
					return getTranslation(
						"global.ruleBuilder.conditionBuilder.inCollection",
						collectionName
					);
				}

				case "not-in-collection": {
					const collection = find(
						collections,
						(col) => col.id === cond.id
					);
					if (!collection) {
						return "";
					}
					const collectionName = collection.name;
					andString = getTranslation(
						"global.ruleBuilder.conditionBuilder.and"
					);
					return getTranslation(
						"global.ruleBuilder.conditionBuilder.notInCollection",
						collectionName
					);
				}
				case "duration": {
					const duration = cond.duration;
					return duration === 1
						? getTranslation(
								"global.ruleBuilder.conditionBuilder.longerThanMin",
								duration
						  )
						: getTranslation(
								"global.ruleBuilder.conditionBuilder.longerThanMins",
								duration
						  );
				}
				default:
					break;
			}
		});

		return conditions.map((condition) => {
			if (!condition) {
				return null;
			}
			return (
				<div key={condition} className="rule-statement-container">
					<span className="and-string">{andString}</span>
					<span>{condition}</span>
				</div>
			);
		});
	}
};

export default getConditions;
