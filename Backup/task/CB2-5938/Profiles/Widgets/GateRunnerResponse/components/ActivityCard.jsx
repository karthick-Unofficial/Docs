import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Typography, ListItem } from "@mui/material";
import { Translate } from "orion-components/i18n";
import moment from "moment";
import { useSelector } from "react-redux";
import { contextById } from "orion-components/ContextualData/Selectors";

import ElapsedTimer from "./ElapsedTimer";

const propTypes = {
	dir: PropTypes.string
};

const defaultProps = {
	dir: "ltr"
};

const useStyles = makeStyles({
	root: {
		"&:hover": {
			backgroundColor: "#464a50"
		}
	}
});

const ActivityCard = ({
	detection,
	selectedDetection,
	handleSelectDetection,
	dir,
	initialActivityDate,
	eventEndDate
}) => {
	const classes = useStyles();

	const activity = selectedDetection && selectedDetection.object.entity;
	const activityId = selectedDetection && selectedDetection.id;

	const locale = useSelector((state) => state.i18n.locale);
	const context = useSelector((state) => contextById(activityId)(state));

	const [carImage, setCarImage] = useState(null);

	useEffect(() => {
		if (context && context.attachments) {
			const filteredImage = context.attachments
				.filter((attachment) => attachment.filename.includes("plate"))
				.map((filteredAttachment) => filteredAttachment.handle);
			if (filteredImage && filteredImage.length === 1) {
				setCarImage(`/_download?handle=${filteredImage}`);
			}
		}
	}, [context]);

	const styles = {
		activityCardWrapper: {
			padding: "0px 6px",
			...(dir === "rtl" && { direction: "rtl" }),
			...(selectedDetection ? { padding: 0, marginBottom: 20 } : { padding: "15px" })
		},
		lprCard: {
			textAlign: "center",
			...(selectedDetection ? { width: "55%", background: "#1f1f21", padding: "5px 15px" } : { width: "45%" })
		},
		gate: {
			...(selectedDetection ? { fontSize: 14 } : { fontSize: 12 }),
			color: "#fff",
			lineHeight: "unset",
			textTransform: "uppercase"
		},
		vehicle: {
			fontSize: 12,
			...(selectedDetection ? { padding: "0px 0px 5px 0px" } : { padding: "5px 0px 0px 0px" }),
			color: "#B3B8BC",
			lineHeight: "unset",
			textTransform: "capitalize"
		},
		lprImageWrapper: {
			margin: "5px 0",
			border: "1px solid #fff",
			...(selectedDetection ? { height: "45px" } : { height: "40px" })
		},
		img: {
			height: "100%",
			width: "100%"
		},
		timeAgo: {
			fontSize: 10,
			color: "#fff",
			lineHeight: "unset"
		},
		vehicleImgWrapper: {
			minHeight: "100%",
			width: "52%",
			...(dir === "rtl" && { margin: "5px 25px 5px 0px" }),
			...(dir === "ltr" && { margin: "5px 0 5px 25px" })
		},
		vehicleImgDiv: {
			height: "80px",
			display: "flex",
			justifyContent: "center"
		},
		selectedGateWrapper: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			...(dir === "rtl" && { paddingRight: "15px", textAlign: "right" }),
			...(dir === "ltr" && { paddingLeft: "15px" })
		}
	};

	moment.relativeTimeThreshold("ss", 0);

	return activity ? (
		<>
			<div>
				<Typography style={styles.vehicle}>
					{activity.CarColor && activity.CarColor !== "" ? `${activity.CarColor} ` : ""}
					{activity.Make && activity.Make !== "" ? `${activity.Make} ` : ""}
					{activity.Model && activity.Model !== "" ? `${activity.Model}` : ""}
				</Typography>
			</div>
			<ListItem style={styles.activityCardWrapper}>
				<div style={styles.lprCard}>
					<div style={styles.lprImageWrapper}>
						<img alt={"License Plate"} style={styles.img} src={carImage} />
					</div>
					<Typography style={styles.gate}>{activity.CarNumber}</Typography>
				</div>
				<div style={styles.selectedGateWrapper}>
					<Typography
						style={{
							fontSize: "14px",
							color: "#fff",
							lineHeight: "unset",
							paddingBottom: "10px",
							textTransform: "uppercase"
						}}
					>
						{activity.CameraName}
					</Typography>
					<Typography
						style={{
							color: "#B4B8BC",
							fontSize: 10,
							lineHeight: "unset"
						}}
					>
						<Translate value={"global.profiles.widgets.gateRunnerWidget.activityCard.elapsedTime"} />
					</Typography>
					{initialActivityDate ? (
						<ElapsedTimer initialActivityDate={initialActivityDate} eventEndDate={eventEndDate} />
					) : (
						<Typography
							style={{
								color: "#fff",
								fontSize: 22,
								lineHeight: "unset"
							}}
						>
							0m 00s
						</Typography>
					)}
				</div>
			</ListItem>
		</>
	) : detection ? (
		<>
			<ListItem
				button={true}
				onClick={() => handleSelectDetection(detection)}
				style={styles.activityCardWrapper}
				classes={{ root: classes.root }}
			>
				<div style={styles.lprCard}>
					<Typography style={styles.gate}>{detection.CameraName}</Typography>
					<div style={styles.lprImageWrapper}>
						<img
							alt={"License Plate"}
							style={styles.img}
							src={`data:image/jpeg;base64,${detection.plateImage}`}
						/>
					</div>
					<Typography style={styles.gate}>{detection.CarNumber}</Typography>
					<Typography style={styles.timeAgo}>
						{moment(detection.CaptureDateTime).locale(locale).fromNow()}
					</Typography>
				</div>
				<div style={styles.vehicleImgWrapper}>
					<div style={styles.vehicleImgDiv}>
						<img
							alt={"Gate Runner Vehicle"}
							style={styles.img}
							src={`data:image/jpeg;base64,${detection.carImage}`}
						/>
					</div>
					<Typography style={styles.vehicle}>
						{detection.CarColor  && detection.CarColor !== "" ? `${detection.CarColor} ` : ""}
						{detection.Make  && detection.Make ? `${detection.Make} ` : ""}
						{detection.Model  && detection.Model ? detection.Model : ""}
					</Typography>
				</div>
			</ListItem>
		</>
	) : (
		<></>
	);
};

ActivityCard.propTypes = propTypes;
ActivityCard.defaultProps = defaultProps;

export default ActivityCard;
