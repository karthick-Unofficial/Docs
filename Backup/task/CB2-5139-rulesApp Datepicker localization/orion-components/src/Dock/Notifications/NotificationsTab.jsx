import React, { Component, Fragment } from "react";
import TimeNotificationGroup from "./components/TimeNotificationGroup";
import { notificationService } from "client-app-core";
import { Button, Typography, CircularProgress } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

export default class NotificationsTab extends Component {
	constructor(props) {
		super(props);

		this.state = {
			animating: false,
			archive: false,
			loadedPages: 0,
			swapped: false,
			flip: "",
			shouldAllowFetch: true,
			shouldFetchNextPage: true,
			shouldDisplayLoading: false,
			loadingTimeout: null,
			isFetchingNextPage: false
		};
	}

	componentWillReceiveProps = () => {
		const archivedNotifications = this.props.notifications.filter(
			item => item.closed
		);

		if (
			this.state.swapped && // --> in archive mode
			archivedNotifications.length < 10 && // --> less than 10 archived notifications
			!this.state.isFetchingNextPage && // --> not already fetching
			this.state.shouldAllowFetch // --> allowed to fetch
		) {
			this.fetchNextPageConditionally();
		}

		if (this.props.componentState.hasError) {
			this.setState({
				animating: false
			});
		}
	};

	handleDismissClick = () => {
		const activeNotifications = this.props.notifications.filter(n => !n.closed);

		setTimeout(
			() =>
				this.props.closeBulkNotifications(activeNotifications.map(n => n.id)),
			400
		);
		this.setState({
			animating: true
		});
	};

	handleRestoreClick = () => {
		const inactiveNotifications = this.props.notifications.filter(
			n => n.closed
		);

		this.setState({
			animating: true
		});
		setTimeout(() => {
			this.props.reopenBulkNotifications(inactiveNotifications);
			this.fetchNextPageConditionally();
			this.setState({
				animating: false,
				shouldFetchNextPage: false
			});
		}, 400);
	};

	fetchNextPageConditionally = () => {
		let nextPage;
		if (this.state.shouldFetchNextPage) {
			nextPage = this.state.loadedPages + 1;
		} else {
			// If we've reopened any already-loaded notifications, we need to refresh the loaded pages before getting new ones so we don't lose items
			nextPage = this.state.loadedPages;
			this.setState({
				shouldFetchNextPage: true
			});
		}

		this.setState({
			isFetchingNextPage: true // --> block the scroll event until we're done fetching
		});
		notificationService.getArchivedByPage(nextPage, (err, response) => {
			if (err) {
				console.log(err);
				this.props.getArchiveFailed();
			} else {
				//  --> Show notifications
				const archivedNotifications = this.props.notifications.filter(
					item => item.closed
				);
				if (response.length === archivedNotifications.length) {
					// --> If the response has the same items, we want to disable the scroll call for X seconds to avoid excess requests
					this.setState({ shouldAllowFetch: false });
					setTimeout(() => this.setState({ shouldAllowFetch: true }), 10000);
				}
				this.props.getArchiveSuccess(response);
				clearTimeout(this.state.loadingTimeout);
				this.setState({
					loadedPages: nextPage, //  --> This keeps track of the next page we need to load
					shouldDisplayLoading: false,
					isFetchingNextPage: false,
					loadingTimeout: null,
					flip: "full"
				});
			}
		});
	};

	handleArchiveClick = () => {
		// Click should do nothing if we're mid-animation
		if (this.state.isSwapping) {
			return;
		}

		this.setState({
			archive: !this.state.archive,
			isSwapping: true
		});

		// --> Swap views and scroll to top
		// --> Timeouts are relative to animation length

		this.scrollToTop(); //--> Immediate scroll-to-top is annoying, but fixes weird bug where low scrolling causes bleeding together of all the notifications on flip

		// setTimeout(this.scrollToTop, 150);
		setTimeout(() => this.setState({ swapped: !this.state.swapped }), 150);
		// Prevent swap back until animation is complete
		setTimeout(() => this.setState({ isSwapping: false }), 300);

		if (!this.state.swapped) {
			// ---> If we are switching to "Archive"
			this.setState({
				//  --> Wait to finish flip animation until archive notifications have loaded
				flip: "half"
			});
			const loadingTimeout = setTimeout(
				() => this.setState({ shouldDisplayLoading: true }),
				300
			);
			this.setState({ loadingTimeout });

			this.fetchNextPageConditionally();
		} else {
			// ---> If we are switching to "Active"
			setTimeout(this.props.dumpArchive, 300); //  --> Remove all loaded archive notifications; switch back to archive means we're starting fresh at page 1
			this.setState({
				loadedPages: 0,
				shouldFetchNextPage: true,
				shouldAllowFetch: true,
				shouldDisplayLoading: false
			});
		}
	};

	reopenBulkNotifications = notifications => {
		this.setState({
			shouldFetchNextPage: false
		});
		this.props.reopenBulkNotifications(notifications);
	};

	scrollToTop = () => {
		document.getElementById("notification-tab-wrapper").scrollTop = 0;
	};

	render() {
		const { componentState, notifications, expandedAlert, readOnly, forReplay, removeDockedCameraAndState, endDate } = this.props;
		const { isFetchingNextPage, shouldAllowFetch } = this.state;
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
							<p><Translate value="global.dock.notifications.main.errorOcc"/></p>
						</div>
					)}
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end"
						}}
					>
						{this.state.archive ? (
							<Button
								color="primary"
								style={{ textTransform: "none" }}
								onClick={this.handleArchiveClick}
							>
								<Translate value="global.dock.notifications.main.viewActive"/>
							</Button>
						) : (
							<Fragment>
								<Button
									color="primary"
									style={{ textTransform: "none" }}
									onClick={this.handleArchiveClick}
								>
									<Translate value="global.dock.notifications.main.viewArchive"/>
								</Button>
								{activeNotifications.length > 0 && !readOnly && (
									<Button
										color="primary"
										style={{ textTransform: "none" }}
										onClick={this.handleDismissClick}
									>
										<Translate value="global.dock.notifications.main.dismissAll"/>
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
							{this.state.shouldDisplayLoading && componentState.hasError && (
								<Typography
									style={{ padding: "24px 0px" }}
									align="center"
									variant="caption"
								>
									<Translate value="global.dock.notifications.main.checkNetConn"/>
								</Typography>
							)}
							{this.state.shouldDisplayLoading && !componentState.hasError && (
								<Typography
									style={{ padding: "24px 0px" }}
									align="center"
									variant="caption"
								>
									<Translate value="global.dock.notifications.main.loading"/>
								</Typography>
							)}
						</div>
					</div>
				</div>
				<div
					className={
						"flip-container" +
						(this.state.archive && this.state.flip === "half"
							? " half-flip"
							: this.state.archive && this.state.flip === "full"
								? " flip"
								: "")
					}
				>
					<div className="flipper">
						<div className="front">
							{!this.state.swapped &&
								(activeNotifications.length === 0 ? (
									<Typography
										style={{ padding: "24px 0px" }}
										align="center"
										variant="caption"
									>
										<Translate value="global.dock.notifications.main.noNotifications"/>
									</Typography>
								) : (
									<TimeNotificationGroup
										archive={false}
										readOnly={readOnly}
										forReplay={forReplay}
										expandedAlert={expandedAlert}
										notifications={activeNotifications}
										animating={this.state.animating}
										bulkAction={this.props.closeBulkNotifications}
										componentState={componentState}
										removeDockedCameraAndState={removeDockedCameraAndState}
										endDate={endDate}
									/>
								))}
						</div>
						<div className="back">
							{this.state.swapped &&
								(archivedNotifications.length === 0 ? (
									<Typography
										style={{ padding: "24px 0px" }}
										align="center"
										variant="caption"
									>
										<Translate value="global.dock.notifications.main.archiveEmpty"/>
									</Typography>
								) : (
									<TimeNotificationGroup
										archive={true}
										notifications={archivedNotifications}
										readOnly={readOnly}
										forReplay={forReplay}
										animating={this.state.animating}
										bulkAction={this.reopenBulkNotifications}
										componentState={componentState}
										fetchNextPage={this.fetchNextPageConditionally}
										fetching={isFetchingNextPage}
										shouldFetch={shouldAllowFetch}
										removeDockedCameraAndState={removeDockedCameraAndState}
										endDate={endDate}
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
	}
}
