import React, { memo } from "react";
import PropTypes from "prop-types";
import BerthGroup from "../BerthGroup/BerthGroup";
import PendingAssignments from "../PendingAssignments/PendingAssignments";
import { Link, Paper, Typography } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";
import { useSelector, useDispatch } from "react-redux";
import { orderedGroupSelector, getScheduledPending } from "../selectors";
import { openBerthManager } from "./berthScheduleActions";

const propTypes = {
	berthGroups: PropTypes.array,
	openBerthManager: PropTypes.func.isRequired,
	offset: PropTypes.number.isRequired
};

const defaultProps = {
	berthGroups: [],
	location: null
};

const BerthSchedule = () => {
	const dispatch = useDispatch();
	const { offset } = useSelector(state => getScheduledPending(state));
	const berthGroups = useSelector(state => orderedGroupSelector(state));

	const offsetSize = (offset + 1) * 50;
	return (
		<div>
			<PendingAssignments />
			<div
				style={{
					height: `calc(100vh - ${112 +
						(!offset ? 135 : 100 + offsetSize)}px)`,
					overflowY: "scroll",
					zIndex: 99
				}}
			>
				{berthGroups.length ? (
					berthGroups.map(group => {
						return <BerthGroup key={group.id} group={group} />;
					})
				) : (
					<Paper
						style={{
							height: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}}
					>
						<Typography variant="h5"><Translate value="berthSchedule.noData" /></Typography>
						<Link
							component="button"
							onClick={() => dispatch(openBerthManager())}
							style={{ padding: "0px 4px 0px 4px" }}
							variant="h5"
						>
							<Translate value="berthSchedule.clickHere" />
						</Link>
						<Typography variant="h5"><Translate value="berthSchedule.toManage" /></Typography>
					</Paper>
				)}
			</div>
		</div>
	);
};

BerthSchedule.propTypes = propTypes;
BerthSchedule.defaultProps = defaultProps;

export default memo(BerthSchedule);
