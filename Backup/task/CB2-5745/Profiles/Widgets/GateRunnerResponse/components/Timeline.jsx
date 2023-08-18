import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import size from "lodash/size";
import unionBy from "lodash/unionBy";
import { Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { startAttachmentStream } from "orion-components/ContextualData/Actions";
import { useDispatch, useSelector } from "react-redux";
import { brcService, eventService } from "client-app-core";
import { mapObject } from "orion-components/AppState/Selectors";
import { contextById } from "orion-components/ContextualData/Selectors";
import { getAllUnits } from "orion-components/GlobalData/Units/selectors";
import { subscribeUnitMembers } from "orion-components/GlobalData/Actions";

import TimelineCard from "./TimelineCard";
import { TargetObserved } from "../Icons";

const propTypes = {
	dir: PropTypes.string
};

const defaultProps = {
	dir: "ltr"
};

const Timeline = (props) => {
	const {
		event,
		dir,
		activities,
		unsubscribeFromFeed,
		subscriberRef,
		initialActivityDate,
		recentActivityId,
		feedSettings,
		unitsApp
	} = props;
	const id = event.id;

	const dispatch = useDispatch();

	const [open, setOpen] = useState(null);
	const [recommendedUnit, setRecommendedUnit] = useState([]);
	const [mapSelectionMode, setMapSelectionMode] = useState(false);
	const [recommendations, setRecommendations] = useState([]);
	const mapSelectionRef = useRef(mapSelectionMode);

	const activityId = open;
	let attachments = [];

	const map = useSelector(state => mapObject(state));
	const context = useSelector(state => contextById(activityId)(state));
	const units = useSelector(state => getAllUnits(state));

	if (context) {
		attachments = context.attachments;
	}

	const handleCardExpand = id => {
		if (open === id) {
			setOpen(null);
		} else {
			setOpen(id);
			setRecommendedUnit([]);
			setRecommendations([]);
			dispatch(startAttachmentStream(id, "profile"));
			if (size(unitsApp))
				streamRecommendations(id);
		}
	};

	const handleCardCollapse = () => {
		setOpen(null);
		setRecommendedUnit([]);
		setRecommendations([]);
	};

	const toggleMapSelection = () => {
		setMapSelectionMode(!mapSelectionMode);
		mapSelectionRef.current = !mapSelectionMode;
	};

	const streamRecommendations = (activityId) => {
		brcService.streamRecommendations(activityId, (err, response) => {
			if (err) console.log(err);
			if (response) {
				switch (response.type) {
					case "initial":
					case "add":
						setRecommendations([response.new_val]);
						break;
					default:
						break;
				}
			}
		});
	};

	const handleUnsubscribe = () => {
		if (context && activityId) {
			const { subscriptions } = context;
			Object.keys(subscriptions).forEach(subscription =>
				dispatch(unsubscribeFromFeed(activityId, subscription, "dock"))
			);
		}
	};

	const handleNotify = (recommendationIds) => {
		brcService.notifyRecommendations(recommendationIds, (err, res) => {
			if (err) {
				console.log(err);
			} else {
				streamRecommendations(open);
			}
		});
	};

	useEffect(() => {
		dispatch(subscribeUnitMembers());

		return () => {
			handleUnsubscribe();
			if (unsubscribeFromFeed)
				dispatch(unsubscribeFromFeed(id, "activities", subscriberRef));
		};
	}, []);

	useEffect(() => {
		if (map && mapSelectionMode) {
			map.once("click", e => {
				if (mapSelectionRef.current) {
					const coords = [e.lngLat.lng, e.lngLat.lat];
					eventService.generateLocationActivity(id, coords, null, (err, res) => {
						if (err) {
							console.log(err);
						}
					});
					setMapSelectionMode(false);
					mapSelectionRef.current = false;
				}
			});
		}
	}, [mapSelectionMode]);

	useEffect(() => {
		if (recentActivityId) {
			handleCardExpand(recentActivityId);
		}
	}, [recentActivityId]);

	useEffect(() => {
		if (size(units) && size(recommendations)) {
			recommendations.map((recommendation) => {
				const unitId = recommendation.unitId;
				const unit = units.find((unit) => unit.id === unitId);

				if (unit) {
					unit["recommendationId"] = recommendation.id;
					unit["notified"] = recommendation.notified;
					unit["locationName"] = recommendation.locationName;
					setRecommendedUnit(unionBy([unit], recommendedUnit, "id"));
				}
			});
		}
	}, [recommendations]);


	const styles = {
		timeline: {
			color: "#B4B8BC",
			fontSize: 12,
			margin: "15px 0 10px 0",
			width: "50%",
			...(dir === "rtl" && { textAlign: "right" })
		},
		targetWrapper: {
			display: "flex",
			direction: dir
		},
		targetObserved: {
			display: "flex",
			justifyContent: "flex-end",
			alignItems: "center",
			width: "50%",
			...(!mapSelectionMode && { color: "rgb(255, 255, 255, 0.7)" })
		},
		typography: {
			color: "inherit",
			fontSize: 12,
			...(dir === "rtl" && { marginRight: 10 }),
			...(dir === "ltr" && { marginLeft: 10 })
		}
	};

	return (
		<div style={styles.timelineWrapper}>
			{size(activities) ?
				<>
					<div style={styles.targetWrapper}>
						<Typography style={styles.timeline}>
							<Translate value={"global.profiles.widgets.gateRunnerWidget.timeline.title"} />
						</Typography>
						<a className="cb-font-link" style={styles.targetObserved} onClick={() => toggleMapSelection()}>
							<TargetObserved />
							<Typography style={styles.typography}>
								<Translate value={"global.profiles.widgets.gateRunnerWidget.timeline.targetObserved"} />
							</Typography>
						</a>
					</div>
					{Object.values(activities)
						.sort((a, b) => {
							return moment.utc(b.activityDate) - moment.utc(a.activityDate);
						})
						.map((activity, index) => {
							return <TimelineCard
								key={index}
								captured={activities.length - index}
								geometry={activity.geometry}
								dir={dir}
								timeline={activity}
								open={open === activity.id}
								attachments={attachments}
								units={recommendedUnit}
								feedSettings={feedSettings}
								initialActivityDate={initialActivityDate}
								handleNotify={handleNotify}
								handleCardExpand={handleCardExpand}
								handleCardCollapse={handleCardCollapse}
							/>;
						})
					}
				</>
				:
				<></>
			}
		</div >
	);
};

Timeline.propTypes = propTypes;
Timeline.defaultProps = defaultProps;

export default Timeline;