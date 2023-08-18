import React, { Fragment, useEffect, useState } from "react";
import TimeNotificationGroup from "./components/TimeNotificationGroup";
import { notificationService } from "client-app-core";
import { Button, Typography, CircularProgress } from "@material-ui/core";
import { Translate } from "orion-components/i18n";

import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "./actions";

const propTypes = {
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object
};

const defaultProps = {
	selectFloorPlanOn: () => { },
	floorPlansWithFacilityFeed: null

};

const NotificationsTab = (props) => {
	const dispatch = useDispatch();

	const {
		notifications,
		componentState,
		readOnly,
		forReplay,
		endDate,
		selectFloorPlanOn,
		floorPlansWithFacilityFeed } = props;

	const {
		closeBulkNotifications,
		reopenBulkNotifications,
		getArchiveFailed,
		getArchiveSuccess,
		dumpArchive,
		removeDockedCameraAndState
	} = actions;

	const expandedAlert = useSelector(state => state.appState.dock.dockData.expandedAlert);
	const userId = useSelector(state => state.session.identity.userId);

	const [animating, setAnimating] = useState(false);
	const [archive, setArchive] = useState(false);
	const [loadedPages, setLoadedPages] = useState(0);
	const [swapped, setSwapped] = useState(false);
	const [flip, setFlip] = useState("");
	const [shouldAllowFetch, setShouldAllowFetch] = useState(true);
	const [shouldFetchNextPage, setShouldFetchNextPage] = useState(true);
	const [shouldDisplayLoading, setShouldDisplayLoading] = useState(false);
	const [loadingTimeout, setLoadingTimeout] = useState(null);
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
	const [isSwapping, setIsSwapping] = useState();


	useEffect(() => {
		const archivedNotifications = notifications.filter(
			item => item.closed
		);

		if (
			swapped && // --> in archive mode
			archivedNotifications.length < 10 && // --> less than 10 archived notifications
			!isFetchingNextPage && // --> not already fetching
			shouldAllowFetch // --> allowed to fetch
		) {
			fetchNextPageConditionally();
		}

		if (componentState.hasError) {
			setAnimating(false);
		}
	}, [props]);


	const handleDismissClick = () => {
		const activeNotifications = notifications.filter(n => !n.closed);
		setTimeout(
			() =>
				dispatch(closeBulkNotifications(activeNotifications.map(n => n.id))),
			400
		);
		setAnimating(true);
	};

	const handleRestoreClick = () => {
		const inactiveNotifications = notifications.filter(
			n => n.closed
		);
		setAnimating(true);
		setTimeout(() => {
			dispatch(reopenBulkNotifications(inactiveNotifications));
			fetchNextPageConditionally();
			setAnimating(false);
			setShouldFetchNextPage(false);
		}, 400);
	};

	const fetchNextPageConditionally = () => {
		let nextPage;
		if (shouldFetchNextPage) {
			nextPage = loadedPages + 1;
		} else {
			// If we've reopened any already-loaded notifications, we need to refresh the loaded pages before getting new ones so we don't lose items
			nextPage = loadedPages;
			setShouldFetchNextPage(true);
		}
		setIsFetchingNextPage(true);
		notificationService.getArchivedByPage(nextPage, (err, response) => {
			if (err) {
				console.log(err);
				dispatch(getArchiveFailed());
			} else {
				//  --> Show notifications
				const archivedNotifications = notifications.filter(
					item => item.closed
				);
				if (response.length === archivedNotifications.length) {
					// --> If the response has the same items, we want to disable the scroll call for X seconds to avoid excess requests
					setShouldAllowFetch(false);
					setTimeout(() => setShouldAllowFetch(true), 10000);
				}
				dispatch(getArchiveSuccess(response));
				clearTimeout(loadingTimeout);
				setLoadedPages(nextPage);
				setShouldDisplayLoading(false);
				setIsFetchingNextPage(false);
				setLoadingTimeout(null);
				setFlip("full");
			}
		});
	};

	const handleArchiveClick = () => {
		// Click should do nothing if we're mid-animation
		if (isSwapping) {
			return;
		}
		setArchive(!archive);
		setIsSwapping(true);

		// --> Swap views and scroll to top
		// --> Timeouts are relative to animation length

		scrollToTop(); //--> Immediate scroll-to-top is annoying, but fixes weird bug where low scrolling causes bleeding together of all the notifications on flip

		// setTimeout(this.scrollToTop, 150);
		setTimeout(() => setSwapped(!swapped), 150);
		// Prevent swap back until animation is complete
		setTimeout(() => setIsSwapping(false), 300);

		if (!swapped) {
			// ---> If we are switching to "Archive"
			setFlip("half");
			const loadingTimeout = setTimeout(
				() => setShouldDisplayLoading(true),
				300
			);
			setLoadingTimeout(loadingTimeout);
			fetchNextPageConditionally();
		} else {
			// ---> If we are switching to "Active"
			setTimeout(dumpArchive, 300);
			//  --> Remove all loaded archive notifications; switch back to archive means we're starting fresh at page 1
			setLoadedPages(0);
			setShouldFetchNextPage(true);
			setShouldAllowFetch(true);
			setShouldDisplayLoading(false);
		}
	};

	const reopenBulkNotificationsEvent = notifications => {
		setShouldFetchNextPage(false);
		dispatch(reopenBulkNotifications(notifications));
	};

	const scrollToTop = () => {
		document.getElementById("notification-tab-wrapper").scrollTop = 0;
	};

	const activeNotifications = notifications.filter(item => !item.closed);
	const archivedNotifications = notifications.filter(item => item.closed);

	return (
		<div
			id="notification-tab-wrapper"
			className={"cf" + (componentState.hasError ? " adjusted" : "")}
		>
			<div>
				{componentState.hasError && (
					<div className="error-message-banner">
						<p><Translate value="global.dock.notifications.main.errorOcc" /></p>
					</div>
				)}
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end"
					}}
				>
					{archive ? (
						<Button
							color="primary"
							style={{ textTransform: "none" }}
							onClick={handleArchiveClick}
						>
							<Translate value="global.dock.notifications.main.viewActive" />
						</Button>
					) : (
						<Fragment>
							<Button
								color="primary"
								style={{ textTransform: "none" }}
								onClick={handleArchiveClick}
							>
								<Translate value="global.dock.notifications.main.viewArchive" />
							</Button>
							{activeNotifications.length > 0 && !readOnly && (
								<Button
									color="primary"
									style={{ textTransform: "none" }}
									onClick={handleDismissClick}
								>
									<Translate value="global.dock.notifications.main.dismissAll" />
								</Button>
							)}
						</Fragment>
					)}
				</div>
			</div>
			<div
				className="flip-container"
				style={{
					position: "absolute"
				}}
			>
				<div className="flipper">
					<div className="front">
						{shouldDisplayLoading && componentState.hasError && (
							<Typography
								style={{ padding: "24px 0px" }}
								align="center"
								variant="caption"
							>
								<Translate value="global.dock.notifications.main.checkNetConn" />
							</Typography>
						)}
						{shouldDisplayLoading && !componentState.hasError && (
							<Typography
								style={{ padding: "24px 0px" }}
								align="center"
								variant="caption"
							>
								<Translate value="global.dock.notifications.main.loading" />
							</Typography>
						)}
					</div>
				</div>
			</div>
			<div
				className={
					"flip-container" +
					(archive && flip === "half"
						? " half-flip"
						: archive && flip === "full"
							? " flip"
							: "")
				}
			>
				<div className="flipper">
					<div className="front">
						{!swapped &&
							(activeNotifications.length === 0 ? (
								<Typography
									style={{ padding: "24px 0px" }}
									align="center"
									variant="caption"
								>
									<Translate value="global.dock.notifications.main.noNotifications" />
								</Typography>
							) : (
								<TimeNotificationGroup
									archive={false}
									readOnly={readOnly}
									forReplay={forReplay}
									expandedAlert={expandedAlert}
									notifications={activeNotifications}
									animating={animating}
									bulkAction={closeBulkNotifications}
									componentState={componentState}
									removeDockedCameraAndState={removeDockedCameraAndState}
									endDate={endDate}
									selectFloorPlanOn={selectFloorPlanOn}
									floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
								/>
							))}
					</div>
					<div className="back">
						{swapped &&
							(archivedNotifications.length === 0 ? (
								<Typography
									style={{ padding: "24px 0px" }}
									align="center"
									variant="caption"
								>
									<Translate value="global.dock.notifications.main.archiveEmpty" />
								</Typography>
							) : (
								<TimeNotificationGroup
									archive={true}
									notifications={archivedNotifications}
									readOnly={readOnly}
									forReplay={forReplay}
									animating={animating}
									bulkAction={reopenBulkNotificationsEvent}
									componentState={componentState}
									fetchNextPage={fetchNextPageConditionally}
									fetching={isFetchingNextPage}
									shouldFetch={shouldAllowFetch}
									removeDockedCameraAndState={removeDockedCameraAndState}
									endDate={endDate}
									selectFloorPlanOn={selectFloorPlanOn}
									floorPlansWithFacilityFeed={floorPlansWithFacilityFeed}
								/>
							))}
						{isFetchingNextPage && (
							<div
								style={{
									position: "absolute",
									bottom: 0,
									width: "100%",
									textAlign: "center"
								}}
							>
								<CircularProgress size={200} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};


NotificationsTab.propTypes = propTypes;
NotificationsTab.defaultProps = defaultProps;

export default NotificationsTab;