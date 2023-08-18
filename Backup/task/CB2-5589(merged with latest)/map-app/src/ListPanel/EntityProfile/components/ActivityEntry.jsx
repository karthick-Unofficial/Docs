import React from "react";

// moment
import Moment from "react-moment";
import PropTypes from "prop-types";

const propTypes = {
	activity: PropTypes.object,
	date: PropTypes.date
}

const ActivityEntry = ({ activity, date }) => {
	const getChangeDisplayVal = (change) => {
		let changeDisplayVal = "";
		const activity = activity;
		switch (change.property) {
			case "properties.name":
			case "properties.description":
				changeDisplayVal = change.lhs + " -> " + change.rhs;
				break;
			case "geometry":
				// Once we start using Turf, we could probably customize the message whether the area increased or line lengthened, etc.
				if (change.lhs.type === "Polygon" || change.lhs.type === "LineString" || change.lhs.type === "Line") {
					changeDisplayVal = activity.actor.name + " edited the coordinates of " + activity.object.name;
				} else if (change.lhs.type === "Point") {
					changeDisplayVal = activity.actor.name + " edited the location of " + activity.object.name;
				}

				break;
			default:
				break;
		}
		return changeDisplayVal;
	};
	return (
		<div className="activityEntry">
			<p>{activity.summary}</p>
			{activity.detail !== undefined &&
				activity.detail.changes !== undefined &&
				activity.detail.changes.map((change, index) => (
					<p className="dateTimeFormatter" key={index}>
						{getChangeDisplayVal(change)}
					</p>
				))}
			<div className="dateTimeFormatter">
				<Moment fromNow>{date}</Moment>{" "}
				<span>
					(<Moment format="MM/DD/YYYY HH:mm">{date}</Moment>)
				</span>
			</div>
		</div>
	);
};

ActivityEntry.propTypes = propTypes;

export default ActivityEntry;
