import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { List, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import { AlertProfile } from "orion-components/Profiles";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

const propTypes = {
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object
};

const defaultProps = {
	selectFloorPlanOn: null,
	floorPlansWithFacilityFeed: null
};

const cache = new CellMeasurerCache({
	fixedWidth: true,
	defaultHeight: 140
});

const TimeNotificationGroup = (props) => {
	const dispatch = useDispatch();

	const {
		notifications,
		animating,
		archive,
		expandedAlert,
		fetchNextPage,
		fetching,
		shouldFetch,
		componentState,
		readOnly,
		forReplay,
		removeDockedCameraAndState,
		endDate,
		selectFloorPlanOn,
		floorPlansWithFacilityFeed,
		bulkAction
	} = props;
	const [animatingState, setAnimatingState] = useState(false);
	const [nextNotifications, setNextNotifications] = useState(notifications);
	const [nextAnimating, setNextAnimating] = useState(animating);
	const [wrapper, setWrapper] = useState(null);

	let virtualList = null;

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	useEffect(() => {
		if (notifications.length !== nextNotifications.length) {
			setNextNotifications(notifications);
		}
		if (nextAnimating !== animating) {
			setNextAnimating(animating);
		}
	}, [notifications, animating]);

	useEffect(() => {
		if (nextNotifications.length > notifications.length) {
			setAnimatingState(false);
		} else if (nextAnimating !== animating) {
			setAnimatingState(archive ? "left" : "right");
		}
	}, [props]);

	useEffect(() => {
		if (archive) {
			handleScroll();
		}
	}, []);

	const prevProps = usePrevious(props);

	useEffect(() => {
		const sortedNotifications = notifications.sort((a, b) => {
			if (new Date(b.createdDate) < new Date(a.createdDate)) {
				return -1;
			} else {
				return 1;
			}
		});
		const index = sortedNotifications.findIndex((notification) => notification.id === expandedAlert);
		if (prevProps && virtualList && expandedAlert !== prevProps.expandedAlert && index > -1) {
			const offset = virtualList.getOffsetForRow({
				alignment: "center",
				index
			});
			virtualList.scrollToPosition(offset);
		}
	}, [props]);

	const handleScroll = () => {
		const element = document.getElementById("virtualized-notification-list");
		if (element) {
			element.addEventListener("scroll", (event) => {
				const element = event.target;
				const { scrollTop, clientHeight, scrollHeight } = element;
				if (
					Math.floor(scrollHeight - scrollTop) <= clientHeight && // --> If we scroll to bottom
					!fetching && // --> AND not already fetching
					shouldFetch
				) {
					// --> AND we haven't fetched the same data in the past X seconds
					fetchNextPage();
				}
			});
		}
	};

	const handleBulkClose = (notifications) => {
		setAnimatingState(archive ? "left" : "right");
		// If archived, we need to pass whole notifications
		if (archive) {
			setTimeout(() => dispatch(bulkAction(notifications)), 500);
		} else {
			setTimeout(() => dispatch(bulkAction(notifications.map((n) => n.id))), 500);
		}
	};

	const triggerAnimationGroup = () => {
		setAnimatingState(archive ? "left" : "right");
	};

	useLayoutEffect(() => {
		setWrapper(document.getElementById("notification-tab-wrapper"));
	}, [document.getElementById("notification-tab-wrapper")]);

	const rowRenderer = ({ index, key, parent, style }) => {
		const sortedNotifications = notifications.sort((a, b) => {
			const aDate = a.activityDate || a.createdDate;
			const bDate = b.activityDate || b.createdDate;
			if (new Date(bDate) < new Date(aDate)) {
				return -1;
			} else {
				return 1;
			}
		});
		const notification = sortedNotifications[index];
		const { id, activityId } = notification;
		return (
			<CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
				{({ measure }) => (
					<div id={id} style={style}>
						<AlertProfile
							id={id}
							readOnly={readOnly}
							notification={forReplay ? notification : null}
							activityId={activityId}
							measure={measure}
							index={index}
							removeDockedCameraAndState={removeDockedCameraAndState}
							forReplay={forReplay}
							endDate={endDate}
							selectFloorPlanOn={selectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
						/>
					</div>
				)}
			</CellMeasurer>
		);
	};

	let hasError = false;
	if (notifications[0]) {
		hasError = componentState.rejectedNots.includes(notifications[0].id);
	}

	return (
		<div
			className={
				animatingState && !hasError
					? "notification-group animating animating-" + animatingState
					: "notification-group"
			}
		>
			{wrapper && (
				<List
					id="virtualized-notification-list"
					deferredMeasurementCache={cache}
					height={wrapper.offsetHeight - 36}
					rowCount={notifications.length}
					rowHeight={cache.rowHeight}
					rowRenderer={rowRenderer}
					width={wrapper.offsetWidth}
					ref={(ref) => {
						virtualList = ref;
					}}
				/>
			)}
		</div>
	);
};

TimeNotificationGroup.propTypes = propTypes;
TimeNotificationGroup.defaultProps = defaultProps;

export default TimeNotificationGroup;
