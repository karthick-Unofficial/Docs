import React, { Fragment, useEffect, useState, useRef, memo } from "react";
import { eventService, activityService, unitService, brcService } from "client-app-core";
import { IconButton } from "@mui/material";
import { default as Expand } from "@mui/icons-material/ZoomOutMap";
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
import isEmpty from "lodash/isEmpty";
import { subscribeUnits, subscribeUnitMembers } from "orion-components/GlobalData/Actions";
import {
	startGateRunnerActivityStream,
	startAttachmentStream,
	unsubscribeFromFeed
} from "orion-components/ContextualData/Actions";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import ActivityCard from "./components/ActivityCard";
import ActivityHotList from "./components/ActivityHotList";
import Timeline from "./components/Timeline";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";

import { getDir } from "orion-components/i18n/Config/selector";

const propTypes = {
	id: PropTypes.string,
	event: PropTypes.object,
	selectWidget: PropTypes.func,
	selected: PropTypes.bool,
	subscriberRef: PropTypes.string,
	activities: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	expanded: PropTypes.bool
};

const defaultProps = {};

const filterOptions = {
	types: ["camera-detection", "manual-location", "unit-status-change"],
	private: true
};

const collectionLocationType = { key: "interdictionPointCollection" };

const GateRunnerResponseWidget = (props) => {
	const { id, selectWidget, selected, subscriberRef, contextId, expanded, widgetsExpandable } = props;
	const activities = useSelector((state) => getSelectedContextData(state)(contextId, "activities"));
	const event = useSelector((state) => getSelectedContextData(state)(contextId, "entity"));
	const dispatch = useDispatch();

	const collections = useSelector((state) => state.globalData.collections);
	const applications = useSelector((state) => state.session.user.profile.applications);
	const unitsApp = find(applications, { appId: "units-app" });

	const enabled = useSelector((state) => expanded || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));

	const [selectedDetection, setSelectedDetection] = useState(null);
	const [activitiesState, setActivitiesState] = useState(activities || []);
	const [filteredActivities, setFilteredActivities] = useState([]);
	const [initialActivityDate, setInitialActivityDate] = useState(null);
	const [recentActivityId, setRecentActivityId] = useState(null);
	const [UnassignedFeeds, setUnassignedFeeds] = useState([]);
	const [unitSettings, setUnitSettings] = useState([]);
	const [cardCollection, setCardCollection] = useState([]);
	const [collectionDetails, setCollectionDetails] = useState([]);
	const [detections, setDetections] = useState(null);

	const state = {
		activitiesState,
		unitSettings,
		cardCollection,
		collectionDetails
	};

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
			if (err) console.log(err, response);
		});
	};

	const getActivities = () => {
		const streamedActivities = activities ? activities : [];
		const sorted = activitiesState.sort((a, b) => moment.utc(a.activityDate).diff(moment.utc(b.activityDate)));

		const date = sorted.length > 0 ? sorted[0].activityDate : new Date().toISOString();

		activityService.getActivitiesByEvent(event.id, 1000, date, filterOptions, (err, res) => {
			if (err) console.log(err);
			if (res) {
				if (res.length > 0) {
					setActivitiesState(uniqBy([...activitiesState, ...streamedActivities, ...res], "id"));
				}
			}
		});
	};

	const getCollections = () => {
		unitService.getAppSettingsByKey("units-app", collectionLocationType.key, (err, response) => {
			if (err) {
				console.log("ERROR:", err);
			} else {
				if (response.value) {
					const obj = {
						members: response.value
					};
					setCardCollection(obj);
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
			brcService.getDetections(event.startDate, 60, (err, response) => {
				if (err) console.log("ERROR", err);
				if (!response) return;
				// if error returned will be undefined
				setDetections(response);
			});
		}
		getCollections();

		if (size(unitsApp)) {
			dispatch(subscribeUnits());
			dispatch(subscribeUnitMembers());
			unitService.getAppSettingsByKey("units-app", "unitMemberFeeds", (err, response) => {
				if (err) {
					console.log("ERROR:", err);
				} else {
					setUnitSettings(response);
				}
			});
		}
	}, []);

	useEffect(() => {
		if (prevState) {
			if (!isEqual(activitiesState, prevState.activitiesState)) {
				const filtered = activitiesState.filter((activity) => filterOptions.types.includes(activity.type));
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
			if (!isEmpty(cardCollection) && !isEqual(cardCollection, prevState.cardCollection)) {
				const entityDetails = [];
				const memberId = cardCollection.members;
				entityDetails.push(collections[memberId]);
				setCollectionDetails(entityDetails);
			}
		}
	}, [activitiesState, unitSettings, cardCollection, collectionDetails]);

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
		<div className="widget-wrapper collapsed" style={{ padding: 15 }}>
			<div className="widget-header">
				<div className="cb-font-b2" style={{ fontSize: 14 }}>
					<Translate value={"global.profiles.widgets.gateRunnerWidget.main.title"} />
				</div>
				<div className="widget-header-buttons">
					{widgetsExpandable && (
						<div className="widget-expand-button">
							<IconButton style={styles.widgetExpandButton} onClick={handleExpand}>
								<Expand />
							</IconButton>
						</div>
					)}
				</div>
			</div>
			{selectedPlate ? (
				<div style={{ maxHeight: 540, overflowY: "scroll" }}>
					<ActivityCard
						selectedDetection={selectedDetection}
						initialActivityDate={initialActivityDate}
						eventEndDate={event.endDate}
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
						unitsApp={unitsApp}
					/>
				</div>
			) : (
				<ActivityHotList detections={detections} handleSelectDetection={handleSelectDetection} dir={dir} />
			)}
		</div>
	);
};

GateRunnerResponseWidget.propTypes = propTypes;
GateRunnerResponseWidget.defaultProps = defaultProps;

export default memo(GateRunnerResponseWidget);
