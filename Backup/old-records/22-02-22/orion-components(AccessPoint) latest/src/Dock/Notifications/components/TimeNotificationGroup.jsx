import React, { PureComponent } from "react";
import { List, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import { AlertProfile } from "orion-components/Profiles";

const cache = new CellMeasurerCache({
	fixedWidth: true,
	defaultHeight: 140
});

export default class TimeNotificationGroup extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			animating: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.notifications.length > this.props.notifications.length) {
			this.setState({
				animating: false
			});
		} else if (nextProps.animating !== this.props.animating) {
			this.setState({
				animating: this.props.archive ? "left" : "right"
			});
		}
	}

	componentDidMount = () => {
		const { archive } = this.props;
		if (archive) {
			this.handleScroll();
		}
	};

	componentDidUpdate = (prevProps, prevState) => {
		const { expandedAlert, notifications } = this.props;
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
			this.virtualList &&
			expandedAlert !== prevProps.expandedAlert &&
			index > -1
		) {
			const offset = this.virtualList.getOffsetForRow({
				alignment: "center",
				index
			});
			this.virtualList.scrollToPosition(offset);
		}
	};

	handleScroll = () => {
		const { fetchNextPage } = this.props;
		const element = document.getElementById("virtualized-notification-list");
		if (element) {
			element.addEventListener("scroll", event => {
				const element = event.target;
				const { scrollTop, clientHeight, scrollHeight } = element;
				if (
					Math.floor(scrollHeight - scrollTop) <= clientHeight && // --> If we scroll to bottom
					!this.props.fetching && // --> AND not already fetching
					this.props.shouldFetch
				) {
					// --> AND we haven't fetched the same data in the past X seconds
					fetchNextPage();
				}
			});
		}
	};

	handleBulkClose = notifications => {
		this.setState({
			animating: this.props.archive ? "left" : "right"
		});
		// If archived, we need to pass whole notifications
		if (this.props.archive) {
			setTimeout(() => this.props.bulkAction(notifications), 500);
		} else {
			setTimeout(
				() => this.props.bulkAction(notifications.map(n => n.id)),
				500
			);
		}
	};

	triggerAnimationGroup = () => {
		this.setState({
			animating: this.props.archive ? "left" : "right"
		});
	};

	getWrapper = () => {
		const wrapper = document.getElementById("notification-tab-wrapper");
		if (!wrapper) {
			this.forceUpdate();
		} else {
			return wrapper;
		}
	};

	rowRenderer = ({ index, key, parent, style }) => {
		const { notifications, readOnly, forReplay, removeDockedCameraAndState, endDate } = this.props;
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
						/>
					</div>
				)}
			</CellMeasurer>
		);
	};

	render() {
		const { componentState, notifications } = this.props;
		const { animating } = this.state;
		let hasError = false;
		if (notifications[0]) {
			hasError = componentState.rejectedNots.includes(notifications[0].id);
		}
		const wrapper = this.getWrapper();
		return (
			<div
				className={
					animating && !hasError
						? "notification-group animating animating-" + animating
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
						rowRenderer={this.rowRenderer}
						width={wrapper.offsetWidth}
						ref={ref => (this.virtualList = ref)}
					/>
				)}
			</div>
		);
	}
}
