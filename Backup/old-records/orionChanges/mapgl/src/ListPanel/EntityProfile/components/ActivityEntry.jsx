import React, { PureComponent } from "react";

// moment
import Moment from "react-moment";

class ActivityEntry extends PureComponent {
	getPropFriendlyName = (propName) => {
		let friendlyName = "";
		switch(propName) {
			case "properties.name":
				friendlyName = "Name";
				break;
			case "properties.description":
				friendlyName = "Description";
				break;
			case "geometry":
				// friendlyName = "Coordinates";
				break;
			default:
				break;
		}
		return friendlyName;
	}

	getChangeDisplayVal = (change) => {
		let changeDisplayVal = "";
		const activity = this.props.activity;
		switch(change.property) {
			case "properties.name":
			case "properties.description":
				changeDisplayVal = change.lhs + " -> " + change.rhs;
				break;
			case "geometry":

				// Once we start using Turf, we could probably customize the message whether the area increased or line lengthened, etc.
				if (change.lhs.type === "Polygon" || "LineString" || "Line") {
					changeDisplayVal = activity.actor.name + " edited the coordinates of " + activity.object.name;
				} else if (change.lhs.type === "Point") {
					changeDisplayVal = activity.actor.name + " edited the location of " + activity.object.name;
				}


				break;
			default:
				break;
		}
		return changeDisplayVal;
	}

	render() {
		const { activity, date } = this.props;
		return (
			<div className="activityEntry"> 
				<p>{activity.summary}</p>

				{ (activity.detail !== undefined) && (activity.detail.changes) !== undefined &&
					activity.detail.changes
						.map((change, index) =>
							<p className="dateTimeFormatter" key={index}>{this.getChangeDisplayVal(change)}</p>
						)
				}

				<div className="dateTimeFormatter"><Moment fromNow>{date}</Moment> <span>(<Moment format="MM/DD/YYYY HH:mm">{date}</Moment>)</span></div>
			</div>
	 );
	}
}


export default ActivityEntry;