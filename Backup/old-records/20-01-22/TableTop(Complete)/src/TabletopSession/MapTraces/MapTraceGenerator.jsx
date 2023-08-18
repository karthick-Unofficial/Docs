import _ from "lodash";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import * as utilities from "../../shared/utility/utilities";
import { mapTraceConfig as config } from "./mapTraceConfig";

const propTypes = {
	userInfo: PropTypes.object,
	oldSimTime: PropTypes.number,
	currentSimTime: PropTypes.number,
	newEvents: PropTypes.array.isRequired,
	playStatus: PropTypes.string,
	modificationsActive: PropTypes.bool.isRequired,
	simulationMode: PropTypes.string.isRequired,
	simulationData: PropTypes.object,
	currentAgents: PropTypes.object,
	teamsConfig: PropTypes.object,
	traceDuration: PropTypes.number.isRequired,
	simTimePrecision: PropTypes.number,
	setTraceMapFeatures: PropTypes.func.isRequired
};

const MapTraceGenerator = ({ 
	userInfo,
	oldSimTime, 
	currentSimTime, 
	newEvents, 
	playStatus, 
	modificationsActive, 
	simulationMode,
	simulationData,
	currentAgents,
	teamsConfig,
	traceDuration,
	simTimePrecision,
	setTraceMapFeatures
}) => {
	const [timer, setTimer] = useState(null);

	const traceFeaturesRef = useRef();
	if (!traceFeaturesRef.current) {
		traceFeaturesRef.current = {lines: {}, points: {}};
	}
	const traceFeatures = traceFeaturesRef.current;

	const timerTicksRef = useRef();
	if (!timerTicksRef.current) {
		timerTicksRef.current = {};
	}
	const timerTicksData = timerTicksRef.current;

	const fullTrace = userInfo.isFacilitator || simulationMode === "playback";

	const clearFeatures = () => {
		if (!_.isEmpty(traceFeatures.lines) || !_.isEmpty(traceFeatures.points)) {
			traceFeatures.lines = {};
			traceFeatures.points = {};
			_.keys(timerTicksData).forEach(key => delete timerTicksData[key]);
			setTraceMapFeatures([], []);
		}
	};

	const createFeature = (event) => {
		const team = event.getTeam(simulationData);
		const classification = event.classification;
		return {
			type: "Feature",
			geometry: {
				type: config[classification].featureType,
				coordinates: event.getTraceCoordinates(currentAgents, fullTrace)
			},
			properties: {
				eventId: event.event.id,
				classification,
				team,
				team_class: `${team}_${classification}`,
				desc: event.getDescription(currentAgents, simulationData, simTimePrecision),
				lineColor: teamsConfig[team].iconColor,
				lineDash: config[classification].dasharray
			}
		};
	};

	const tick = () => {
		if (_.isEmpty(timerTicksData)) {
			return;
		}

		const deleteKeys = [];
		_.keys(timerTicksData).forEach(key => {
			const ticksRemaining = timerTicksData[key];
			if (ticksRemaining > 1) {
				timerTicksData[key] = ticksRemaining - 1;
			} else {
				deleteKeys.push(key);
			}
		});

		if (deleteKeys.length > 0) {
			deleteKeys.forEach(key => {
				delete timerTicksData[key];
				if (traceFeatures.lines.hasOwnProperty(key)) {
					delete traceFeatures.lines[key];
				} else if (traceFeatures.points.hasOwnProperty(key)) {
					delete traceFeatures.points[key];
				}
			});
			setTraceMapFeatures(_.values(traceFeatures.lines), _.values(traceFeatures.points));
		}
	};

	useEffect(() => {
		// If we move back in time, we clear all traces
		if (oldSimTime && utilities.doubleGreaterThan(oldSimTime, currentSimTime)) {
			clearFeatures();
			return;
		}

		// If in paused state, where simTime has changed, clear old traces
		if (!timer && playStatus === "paused" && !utilities.doubleEquals(oldSimTime, currentSimTime)) {
			clearFeatures();
		}

		if (newEvents.length > 0) {
			newEvents.forEach(newEvent => {
				if (!newEvent.displayTrace) {
					return;
				}

				const feature = createFeature(newEvent);
				if (feature.geometry.type === "LineString") {
					traceFeatures.lines[newEvent.event.id] = feature;
				} else if (feature.geometry.type === "Point") {
					traceFeatures.points[newEvent.event.id] = feature;
				}
				if (playStatus === "playing") {
					timerTicksData[newEvent.event.id] = traceDuration;
				}
			});
			setTraceMapFeatures(_.values(traceFeatures.lines), _.values(traceFeatures.points));
		}
	}, [ oldSimTime, currentSimTime, newEvents, playStatus ]);

	useEffect(() => {
		if (modificationsActive) {
			clearFeatures();
		}
	}, [ modificationsActive ]);

	useEffect(() => {
		if (playStatus === "playing" && !timer) {
			clearFeatures();
			const timeout = setInterval(tick, 1000);
			setTimer(timeout); 
		}
		if (playStatus === "paused" && timer) {
			clearInterval(timer);
			setTimer(null);
		}
	}, [ playStatus ]);

	return null;
};

MapTraceGenerator.propTypes = propTypes;
export default MapTraceGenerator;