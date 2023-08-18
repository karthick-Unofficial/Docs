import React, { useState } from "react";
import { withSpan } from "../../../Apm";
import moment from "moment";

// Material UI
import Show from "material-ui/svg-icons/navigation/chevron-right";
import Hide from "material-ui/svg-icons/navigation/expand-more";

import _ from "lodash";
import { useDispatch } from "react-redux";

const AlertWidget = ({
	contextId,
	loadProfile,
	notifications,
	closeNotification,
	order,
	enabled
}) => {
	const dispatch = useDispatch();
	
	const [expanded, setExpanded] = useState(false);

	const getSummary = alert => {
		const { object, target } = alert;
		let message;
		// Allow linking to other entities involved in alert
		if (object.id !== contextId) {
			const { id, name, type } = object;
			message = (
				<p className="message">
					<a onClick={() => dispatch(loadProfile(id, name, type, "profile", "primary"))}>
						{name}
					</a>
					{` ${alert.type}ed ${target.name}`}
				</p>
			);
		} else if (target.id !== contextId) {
			const { id, name, type } = target;
			message = (
				<p className="message">
					{`${object.name} ${alert.type}ed `}
					<a onClick={() => dispatch(loadProfile(id, name, type, "profile", "primary"))}>
						{name}
					</a>
				</p>
			);
		}

		return message;
	};

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const activeAlerts = Object.values(notifications.activeItemsById)
		.sort((a, b) => {
			return moment.utc(b.createdDate) - moment.utc(a.createdDate);
		})
		.filter(item => {
			return item.isPriority === true && item.viewed === false;
		})
		.filter(item => {
			return (
				(item.object && item.object.id === contextId) ||
				(item.target && item.target.id === contextId)
			);
		});

	moment.relativeTimeThreshold("h", 24);
	const alertCount = activeAlerts.length;

	return !enabled || !alertCount ? (
		<div />
	) : (
		<section className={`widget-wrapper alert-widget ${"index-" + order}`}>
			<div className="alert-list">
				{activeAlerts
					.filter((alert, index) => {
						if (!expanded) {
							return index === 0;
						} else {
							return alert;
						}
					})
					.map((alert, index) => {
						const { id, createdDate } = alert;
						return (
							<div
								key={index}
								className={`notification-item ${"item-" + index} ${expanded && alertCount > 1 ? "expanded" : "closed"
								}`}
							>
								{index === 0 && alertCount > 1 && (
									<div className="show-hide" onClick={handleExpand}>
										{expanded ? <Hide /> : <Show />}
									</div>
								)}
								<div className="icon-container">
									<div className="info-icon-wrapper">
										<div
											style={{
												width:
													!expanded && alertCount.toString().length > 2
														? alertCount.toString().length * 13
														: ""
											}}
										>
											{expanded ? "!" : alertCount}
										</div>
									</div>
								</div>
								<div className="text-wrapper">
									{getSummary(alert)}
									<p className="time">{moment(createdDate).fromNow()}</p>
								</div>
								<i
									className="material-icons"
									onClick={() => dispatch(closeNotification(id))}
								>
									cancel
								</i>
							</div>
						);
					})}
			</div>
		</section>
	);
};

export default withSpan("alert-widget", "profile-widget")(AlertWidget);
