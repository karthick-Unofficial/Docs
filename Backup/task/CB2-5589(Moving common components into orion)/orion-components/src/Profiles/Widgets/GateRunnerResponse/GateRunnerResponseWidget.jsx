import React, { Fragment, useEffect, useState, useRef, memo } from "react";
import { eventService, activityService, unitService, brcService } from "client-app-core";
import { IconButton, SvgIcon } from "@mui/material";
import { mdiArrowExpand } from "@mdi/js";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Translate } from "orion-components/i18n";
import moment from "moment";
import uniqBy from "lodash/uniqBy";
import isEqual from "lodash/isEqual";
import orderBy from "lodash/orderBy";
import size from "lodash/size";
import last from "lodash/last";
import first from "lodash/first";
import find from "lodash/find";
import { subscribeUnits, subscribeUnitMembers } from "orion-components/GlobalData/Actions";
import { startGateRunnerActivityStream } from "orion-components/ContextualData/Actions";
import { startAttachmentStream } from "orion-components/ContextualData/Actions";

import ActivityCard from "./components/ActivityCard";
import ActivityHotList from "./components/ActivityHotList";
import Timeline from "./components/Timeline";

const propTypes = {
	dir: PropTypes.string
};

const defaultProps = {
	dir: "ltr"
};

const filterOptions = {
	types: ["camera-detection", "manual-location", "unit-status-change"],
	private: true
};

const collectionLocationType = { key: "interdictionPointCollection" };

const GateRunnerResponseWidget = (props) => {
	const {
		event,
		selectWidget,
		selected,
		order,
		enabled,
		widgetsExpandable,
		dir,
		unsubscribeFromFeed,
		subscriberRef,
		activities
	} = props;
	const dispatch = useDispatch();

	const collections = useSelector(state => state.globalData.collections);
	const applications = useSelector(state => state.session.user.profile.applications);
	const unitsApp = find(applications, { appId: "units-app" });

	const [selectedDetection, setSelectedDetection] = useState(null);
	const [activitiesState, setActivitiesState] = useState(activities || []);
	const [filteredActivities, setFilteredActivities] = useState([]);
	const [initialActivityDate, setInitialActivityDate] = useState(null);
	const [recentActivityId, setRecentActivityId] = useState(null);
	const [UnassignedFeeds, setUnassignedFeeds] = useState([]);
	const [unitSettings, setUnitSettings] = useState([]);
	const [cardCollections, setCardCollections] = useState([]);
	const [collectionDetails, setCollectionDetails] = useState([]);
	const [collection, setCollection] = useState([]);
	const [detections, setDetections] = useState(null);

	const state = { activitiesState, unitSettings, cardCollections, collectionDetails };

	const selectedPlate = event.additionalProperties && event.additionalProperties.licensePlate;

	const handleExpand = () => {
		dispatch(selectWidget("Gate Runner Response"));
	};

	const handleSelectDetection = (detection) => {
		const update = {
			additionalProperties: {
				licensePlate: detection.CarNumber,
				startTime: new Date(detection.CaptureDateTime).toISOString()
			}
		};
		eventService.updateEvent(event.id, update, (err, response) => {
			if (err) console.log(err);
		});
	};

	const getActivities = () => {
		const streamedActivities = activities ? activities : [];
		const sorted = activitiesState.sort((a, b) =>
			moment.utc(a.activityDate).diff(moment.utc(b.activityDate))
		);

		const date =
			sorted.length > 0 ? sorted[0].activityDate : (new Date()).toISOString();

		activityService.getActivitiesByEvent(
			event.id,
			1000,
			date,
			filterOptions,
			(err, res) => {
				if (err) console.log(err);
				if (res) {
					if (res.length > 0) {
						setActivitiesState(uniqBy(
							[...activitiesState, ...streamedActivities, ...res],
							"id"
						));
					}
				}
			}
		);
	};

	const getCollections = () => {
		unitService.getAppSettingsByKey("units-app", collectionLocationType.key, (err, response) => {
			if (err) {
				console.log("ERROR:", err);
			}
			else {
				if (response.value) {

					const { value } = response;
					const memberData = [];
					if (value.length > 0) {
						value.forEach(element => {
							const obj = {
								members: element
							};
							memberData.push(obj);
						});
					}
					setCardCollections(memberData);
				}
			}
		});
	};

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevProps = usePrevious(props);
	const prevState = usePrevious(state);

	useEffect(() => {
		if (prevProps) {
			if (!isEqual(activities, prevProps.activities)) {
				setActivitiesState(uniqBy([...activitiesState, ...activities], "id"));
			}
		}
	}, [activities]);

	useEffect(() => {
		if (selectedPlate) {
			getActivities();
		} else {
			brcService.getDetections(
				event.startDate,
				60,
				(err, response) => {
					if (err) console.log("ERROR", err);
					if (!response) return;
					// if error returned will be undefined
					setDetections(response);
				}
			);
		}
		getCollections();

		if (size(unitsApp)) {
			dispatch(subscribeUnits());
			dispatch(subscribeUnitMembers());
			unitService.getAppSettingsByKey("units-app", "unitMemberFeeds", (err, response) => {
				if (err) {
					console.log("ERROR:", err);
				}
				else {
					setUnitSettings(response);
				}
			});
		}
	}, []);

	useEffect(() => {
		if (prevState) {
			if (!isEqual(activitiesState, prevState.activitiesState)) {
				const filtered = activitiesState.filter(activity => filterOptions.types.includes(activity.type));
				const sortedActivities = size(filtered) && orderBy(filtered, ["activityDate"], ["desc"]);

				setFilteredActivities(sortedActivities);

				const firstActivity = last(sortedActivities);
				const recentActivity = first(sortedActivities);
				setInitialActivityDate(firstActivity && firstActivity.activityDate);
				setRecentActivityId(recentActivity && recentActivity.id);

				if (selectedPlate && firstActivity) {
					setSelectedDetection(firstActivity);
					dispatch(startAttachmentStream(firstActivity.id, "profile"));
				}
			}
			if (size(unitSettings) && !isEqual(unitSettings, prevState.unitSettings)) {
				const { value } = unitSettings;
				if (value.length > 0) {
					setUnassignedFeeds(value);
				}
			}
			if (cardCollections.length > 0 && !isEqual(cardCollections, prevState.cardCollections)) {
				const entityDetails = [];
				cardCollections.forEach((element) => {
					const memberId = element.members;
					entityDetails.push(collections[memberId]);
				});
				setCollectionDetails(entityDetails);
			}
			if (!isEqual(collectionDetails, prevState.collectionDetails)) {
				collectionDetails.forEach((element) => {
					setCollection([element]);
				});
			}

		}
	}, [activitiesState, unitSettings, cardCollections, collectionDetails]);

	useEffect(() => {
		if (selectedPlate) {
			dispatch(startGateRunnerActivityStream(event.id, "event", filterOptions, subscriberRef));
		}
	}, [selectedPlate]);

	const styles = {
		label: {
			textTransform: "none"
		},
		cameraButton: {
			display: "flex",
			alignItems: "center",
			backgroundColor: "lighten($darkGray, 2 %)"
		},
		widgetOptionButton: {
			...(dir === "rtl" && {
				marginRight: "auto"
			}),
			...(dir === "ltr" && {
				marginLeft: "auto"
			})
		},
		widgetExpandButton: {
			width: "auto",
			...(dir === "rtl" && {
				paddingLeft: 0
			}),
			...(dir === "ltr" && {
				paddingRight: 0
			})
		}
	};


	return selected || !enabled ? (
		<Fragment />
	) : (
		<div className={`widget-wrapper collapsed ${"index-" + order} `} style={{ padding: 15 }}>
			<div className="widget-header">
				<div className="cb-font-b2" style={{ fontSize: 14 }}>
					<Translate value={"global.profiles.widgets.gateRunnerWidget.main.title"} />
				</div>
				<div className="widget-header-buttons">
					{widgetsExpandable && (
						<div className="widget-expand-button">
							<IconButton
								style={styles.widgetExpandButton}
								onClick={handleExpand}
							>
								<SvgIcon style={{ color: "#fff" }}>
									<path d={mdiArrowExpand} />
								</SvgIcon>
							</IconButton>
						</div>
					)}
				</div>
			</div>
			{selectedPlate ?
				<div style={{ maxHeight: 540, overflowY: "scroll" }}>
					<ActivityCard
						selectedDetection={selectedDetection}
						initialActivityDate={initialActivityDate}
						dir={dir}
					/>
					<Timeline
						event={event}
						dir={dir}
						activities={filteredActivities}
						unsubscribeFromFeed={unsubscribeFromFeed}
						subscriberRef={subscriberRef}
						initialActivityDate={initialActivityDate}
						recentActivityId={recentActivityId}
						feedSettings={UnassignedFeeds}
						collection={collection}
						unitsApp={unitsApp}
					/>
				</div>
				:
				<ActivityHotList
					detections={detections}
					handleSelectDetection={handleSelectDetection}
					dir={dir}
				/>
			}
		</div>
	);
};

GateRunnerResponseWidget.propTypes = propTypes;
GateRunnerResponseWidget.defaultProps = defaultProps;

export default memo(GateRunnerResponseWidget);