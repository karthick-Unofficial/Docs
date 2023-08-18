import React, { useState, useEffect, useRef, useCallback, useReducer } from "react";
import { List, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import { AlertProfile } from "orion-components/Profiles";
import PropTypes from "prop-types";


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
		floorPlansWithFacilityFeed } = props;
	const [animatingState, setAnimatingState] = useState(false);

	const prevPropNotifications = useRef();
	const prevPropAnimating = useRef();
	const prevPropexpandedAlert = useRef();

	const virtualList = useRef();

	//force update

	const [wrapper, setWrapper] = useState(null);


	//useEffect(() => {
	//	prevPropNotifications.current = notifications;
	//	prevPropAnimating.current = animating;
	//	prevPropexpandedAlert.current = expandedAlert;
	//}, [notifications, animating, expandedAlert]);

	useEffect(() => {
		if (notifications.length) {
			setAnimatingState(false);

		} else if (animating) {
			setAnimatingState(archive ? "left" : "right");
		}
	}, [notifications, animating]);


	useEffect(() => {
		if (archive) {
			handleScroll();
		}
	}, []);

	useEffect(() => {
		const sortedNotifications = notifications.sort((a, b) => {
			if (new Date(b.createdDate) < new Date(a.createdDate)) {
				return -1;
			} else {
				return 1;
			}
		});
		const index = sortedNotifications.findIndex(
			notification => notification.id === expandedAlert
		);
		if (
			virtualList &&
			expandedAlert !== prevPropexpandedAlert &&
			index > -1
		) {
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
			element.addEventListener("scroll", event => {
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

	//const handleBulkClose = notifications => {
	//	setAnimatingState(archive ? "left" : "right");
	//	// If archived, we need to pass whole notifications
	//	if (archive) {
	//		setTimeout(() => bulkAction(notifications), 500);
	//	} else {
	//		setTimeout(
	//			() => bulkAction(notifications.map(n => n.id)),
	//			500
	//		);
	//	}
	//};

	const triggerAnimationGroup = () => {
		setAnimatingState(archive ? "left" : "right");
	};


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
			<CellMeasurer
				key={key}
				cache={cache}
				parent={parent}
				columnIndex={0}
				rowIndex={index}
			>
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
	useEffect(() => {
		if (wrapper !== null) {
			setWrapper((document.getElementById("notification-tab-wrapper")));
		}
	}, [wrapper]);

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
					ref={virtualList}
				/>
			)}
		</div>
	);
};


TimeNotificationGroup.propTypes = propTypes;
TimeNotificationGroup.defaultProps = defaultProps;

export default TimeNotificationGroup;