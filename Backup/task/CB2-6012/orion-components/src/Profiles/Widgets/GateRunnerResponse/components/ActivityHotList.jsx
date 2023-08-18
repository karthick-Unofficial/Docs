import React from "react";
import { Divider, Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";
import PropTypes from "prop-types";
import size from "lodash/size";
import isArray from "lodash/isArray";

import ActivityCard from "./ActivityCard";

const propTypes = {
	dir: PropTypes.string
};

const defaultProps = {
	dir: "ltr"
};

const ActivityHotList = ({ detections, handleSelectDetection, dir }) => {
	const styles = {
		timeline: {
			color: "#FFFFFF",
			fontSize: 12,
			margin: "5px 0 10px 0",
			...(dir === "rtl" && { textAlign: "right" })
		}
	};

	return (
		<div>
			{size(detections) && isArray(detections) ? (
				<div style={{ maxHeight: 540, overflowY: "scroll" }}>
					<Typography style={styles.timeline}>
						<Translate value={"global.profiles.widgets.gateRunnerWidget.activityHotList.chooseAlert"} />
					</Typography>
					{detections.map((detection, index) => {
						return (
							<>
								<ActivityCard
									key={`activity-card-${detection.id}`}
									detection={detection}
									handleSelectDetection={handleSelectDetection}
									dir={dir}
								/>
								{index !== detections.length - 1 ? (
									<Divider style={{ borderColor: "#494D53" }} />
								) : null}
							</>
						);
					})}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

ActivityHotList.propTypes = propTypes;
ActivityHotList.defaultProps = defaultProps;

export default ActivityHotList;
