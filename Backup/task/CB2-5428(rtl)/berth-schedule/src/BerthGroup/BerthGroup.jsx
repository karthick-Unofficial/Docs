import React, { memo } from "react";
import PropTypes from "prop-types";
import { Canvas } from "orion-components/CBComponents";
import BerthColumn from "./BerthColumn/BerthColumn";
import BerthTimeline from "./BerthTimeline/BerthTimeline";

const propTypes = {
	group: PropTypes.object.isRequired
};

const BerthGroup = ({ group }) => {
	return (
		<div style={{ display: "flex", height: "calc(100vh - 247px)" }}>
			<BerthColumn groupId={group.id} group={group} />
			<Canvas padding={0}>
				<BerthTimeline groupId={group.id} />
			</Canvas>
		</div>
	);
};

BerthGroup.propTypes = propTypes;

export default memo(BerthGroup);
