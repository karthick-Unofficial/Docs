import React, { useState } from "react";
import { withSpan } from "../../../Apm";
import moment from "moment";

// Material UI
import { default as Show } from "@mui/icons-material/ChevronRight";
import { default as Hide } from "@mui/icons-material/ExpandMore";

import { useDispatch, useSelector } from "react-redux";

import { getWidgetState } from "orion-components/Profiles/Selectors";
import PropTypes from "prop-types";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";
import { closeNotification } from "orion-components/Dock/Actions/index.js";
import { loadProfile } from "orion-components/ContextPanel/Actions";

const propTypes = {
	id: PropTypes.string,
	contextId: PropTypes.string
};

const AlertWidget = ({ contextId, id }) => {
	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled"));
	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity")) ?? {};

	const notifications = useSelector((state) => (entity ? state.globalData.notifications : null));

	const dispatch = useDispatch();
	const locale = useSelector((state) => state.i18n.locale);
	moment.locale(locale); // support date localization

	const [expanded, setExpanded] = useState(false);

	const getSummary = (alert) => {
		const { object, target, message } = alert;
		let summary;
		// Allow linking to other entities involved in alert
		if (object.id !== contextId) {
			summary = message
				.split(object.name)
				.flatMap((item, index) => [
					item,
					<a
						key={`object-link-${index}`}
						onClick={() => dispatch(loadProfile(object.id, object.name, object.type, "profile", "primary"))}
					>
						{object.name}
					</a>
				])
				.slice(0, -1);
		} else if (target.id !== contextId) {
			summary = message
				.split(target.name)
				.flatMap((item, index) => [
					item,
					<a
						key={`target-link-${index}`}
						onClick={() => dispatch(loadProfile(target.id, target.name, target.type, "profile", "primary"))}
					>
						{target.name}
					</a>
				])
				.slice(0, -1);
		}

		return <p className="message">{summary}</p>;
	};

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const activeAlerts = Object.values(notifications.activeItemsById)
		.sort((a, b) => {
			return moment.utc(b.createdDate) - moment.utc(a.createdDate);
		})
		.filter((item) => {
			return item.isPriority === true && item.viewed === false;
		})
		.filter((item) => {
			return (item.object && item.object.id === contextId) || (item.target && item.target.id === contextId);
		});

	moment.relativeTimeThreshold("h", 24);
	const alertCount = activeAlerts.length;

	return !enabled || !alertCount ? (
		<div />
	) : (
		<section className="widget-wrapper alert-widget">
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
								<i className="material-icons" onClick={() => dispatch(closeNotification(id))}>
									cancel
								</i>
							</div>
						);
					})}
			</div>
		</section>
	);
};

AlertWidget.propTypes = propTypes;

export default withSpan("alert-widget", "profile-widget")(AlertWidget);
